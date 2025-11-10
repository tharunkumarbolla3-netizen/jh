import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongodb';
import Task, { ITask } from '../../models/Task';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

interface TaskRequestBody {
  title?: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'complete';
  progress?: number;
}

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.join(', ')
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID format'
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate task detected'
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
};

app.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

app.get('/api/tasks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();

    const tasks = await Task.find().sort({ created_at: -1 });

    res.json({
      success: true,
      tasks: tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        progress: task.progress,
        created_at: task.created_at,
        updated_at: task.updated_at,
        completed_at: task.completed_at
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();

    const { title, description, status = 'not_started' }: TaskRequestBody = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Task title cannot exceed 100 characters'
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Task description cannot exceed 500 characters'
      });
    }

    const validStatuses = ['not_started', 'in_progress', 'complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: not_started, in_progress, complete'
      });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      status
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      task: {
        _id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        progress: newTask.progress,
        created_at: newTask.created_at,
        updated_at: newTask.updated_at,
        completed_at: newTask.completed_at
      }
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();

    const { id } = req.params;
    const updates: TaskRequestBody = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }

    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Task title cannot be empty'
        });
      }
      if (updates.title.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Task title cannot exceed 100 characters'
        });
      }
      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (updates.description && updates.description.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'Task description cannot exceed 500 characters'
        });
      }
      updates.description = updates.description.trim();
    }

    if (updates.status !== undefined) {
      const validStatuses = ['not_started', 'in_progress', 'complete'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: not_started, in_progress, complete'
        });
      }
    }

    if (updates.progress !== undefined) {
      if (typeof updates.progress !== 'number' || updates.progress < 0 || updates.progress > 100) {
        return res.status(400).json({
          success: false,
          error: 'Progress must be a number between 0 and 100'
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...updates, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      task: {
        _id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        progress: updatedTask.progress,
        created_at: updatedTask.created_at,
        updated_at: updatedTask.updated_at,
        completed_at: updatedTask.completed_at
      }
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format'
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      taskId: id
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('Starting Express server...');
    console.log('Connecting to MongoDB...');

    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Express server running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;