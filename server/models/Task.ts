import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'not_started' | 'in_progress' | 'complete';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  progress: number;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Task description cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    required: [true, 'Task status is required'],
    enum: {
      values: ['not_started', 'in_progress', 'complete'],
      message: 'Status must be one of: not_started, in_progress, complete'
    },
    default: 'not_started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

TaskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'not_started':
        this.progress = 0;
        this.completed_at = undefined;
        break;
      case 'in_progress':
        this.progress = this.progress === 0 ? 50 : this.progress;
        this.completed_at = undefined;
        break;
      case 'complete':
        this.progress = 100;
        this.completed_at = new Date();
        break;
    }
  }
  next();
});

TaskSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate() as any;
  if (update && update.status) {
    switch (update.status) {
      case 'not_started':
        update.progress = 0;
        update.completed_at = undefined;
        break;
      case 'in_progress':
        if (!update.progress || update.progress === 0) {
          update.progress = 50;
        }
        update.completed_at = undefined;
        break;
      case 'complete':
        update.progress = 100;
        update.completed_at = new Date();
        break;
    }
  }
  next();
});

TaskSchema.index({ status: 1 });
TaskSchema.index({ created_at: -1 });
TaskSchema.index({ updated_at: -1 });

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;