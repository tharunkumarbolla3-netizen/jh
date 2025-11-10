# Task Tracker with Status

A full-stack task tracking application built with Next.js 16, React 19, TypeScript, Express.js, MongoDB, and Tailwind CSS.

## Features

- ✅ Create, edit, and delete tasks
- ✅ Track task progress with visual indicators
- ✅ Status management: Not Started → In Progress → Complete
- ✅ Responsive card grid layout
- ✅ Real-time statistics dashboard
- ✅ Form validation and error handling
- ✅ RESTful API with Express.js
- ✅ MongoDB data persistence

## Technology Stack

### Frontend
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Client-side state management**

### Backend
- **Express.js** REST API server
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **Environment variable configuration**

## Project Structure

```
jh/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main task tracker page
│   │   └── layout.tsx             # Root layout
│   ├── components/
│   │   ├── TaskCard.tsx           # Individual task card component
│   │   ├── TaskForm.tsx           # Add/edit task form
│   │   └── TaskGrid.tsx           # Grid container for tasks
│   └── app/
│       └── globals.css            # Global styles
├── server/
│   ├── server.ts                  # Express server setup
│   ├── mongodb.ts                 # MongoDB connection
│   └── models/
│       └── Task.ts                # Mongoose Task model
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variables template
├── .env.local                     # Local environment variables
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository** (if applicable)
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tasktracker
   API_PORT=3001
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Running the Application

#### Development Mode

Start both the Express server and Next.js development server:

```bash
npm run dev
```

This will start:
- Express API server on `http://localhost:3001`
- Next.js frontend on `http://localhost:3000`

#### Production Mode

Build and start the application:

```bash
npm run build
npm start
```

## API Endpoints

### Tasks CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task Schema

```typescript
{
  _id: string,
  title: string (required, max 100 chars),
  description: string (optional, max 500 chars),
  status: 'not_started' | 'in_progress' | 'complete',
  progress: number (0-100),
  created_at: Date,
  updated_at: Date,
  completed_at?: Date
}
```

### Status Flow

- **Not Started**: `status = 'not_started'`, `progress = 0`
- **In Progress**: `status = 'in_progress'`, `progress = 50` (default)
- **Complete**: `status = 'complete'`, `progress = 100`, `completed_at = timestamp`

## Manual Testing Plan

### 1. Testing API Endpoints

```bash
# Start the server first
npm run server:dev

# Test GET all tasks
curl http://localhost:3001/api/tasks

# Test POST create task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test description","status":"not_started"}'

# Test PUT update task
curl -X PUT http://localhost:3001/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

# Test DELETE task
curl -X DELETE http://localhost:3001/api/tasks/{task-id}
```

### 2. Testing Frontend Interface

1. **Load the application** (`http://localhost:3000`)
2. **Verify empty state** when no tasks exist
3. **Click "Add New Task"** and fill out the form:
   - Title: Required field
   - Description: Optional field
   - Status: Dropdown selection
4. **Submit the form** and verify the task appears in the grid
5. **Test task operations**:
   - Edit task details
   - Change task status via dropdown
   - Delete task with confirmation
6. **Verify statistics dashboard** updates correctly

### 3. Testing Status Progress Logic

1. **Create task as "Not Started"** → Should show 0% progress
2. **Update to "In Progress"** → Should show 50% progress
3. **Update to "Complete"** → Should show 100% progress with green bar
4. **Update back to "In Progress"** → Should show 50% progress

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | - |
| `MONGODB_DB` | Database name | `tasktracker` |
| `API_PORT` | Express server port | `3001` |
| `NEXT_PUBLIC_API_URL` | API URL for frontend | `http://localhost:3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both API server and Next.js in development |
| `npm run build` | Build Next.js for production |
| `npm start` | Start both servers in production |
| `npm run server:dev` | Start only Express server in development |
| `npm run server:prod` | Start only Express server in production |
| `npm run server:build` | Compile TypeScript server to JavaScript |
| `npm run lint` | Run ESLint |

## Features Implemented

### ✅ Complete CRUD Operations
- Create tasks with validation
- Read all tasks with sorting
- Update individual task fields
- Delete tasks with confirmation

### ✅ Status Management System
- Three status levels: Not Started, In Progress, Complete
- Automatic progress calculation based on status
- Visual progress bars with color coding
- Status change history with timestamps

### ✅ User Interface
- Responsive card grid layout
- Task statistics dashboard
- Modal forms for create/edit operations
- Loading states and error handling
- Empty state messaging

### ✅ Data Validation
- Title: Required, max 100 characters
- Description: Optional, max 500 characters
- Status: Must be valid enum value
- Client and server-side validation

### ✅ Error Handling
- Comprehensive error messages
- API response standardization
- User-friendly error display
- Network error handling

## Production Deployment Notes

1. **MongoDB**: Use MongoDB Atlas for cloud hosting
2. **Environment**: Set `NODE_ENV=production`
3. **Security**: Add authentication middleware if needed
4. **Performance**: Add caching and rate limiting as needed
5. **Monitoring**: Add logging and monitoring tools

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env.local`
   - Ensure proper network access

2. **Port Already in Use**
   - Change `API_PORT` in environment variables
   - Kill processes using the port

3. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript configuration files

4. **CORS Issues**
   - Verify `FRONTEND_URL` matches your frontend URL
   - Check API request URLs in browser console