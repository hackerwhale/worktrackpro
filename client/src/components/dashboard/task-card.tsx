import { Link } from "wouter";
import { Task, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  users: User[];
}

const TaskCard = ({ task, users }: TaskCardProps) => {
  // Helper function to get user by ID
  const getUserById = (userId?: number) => {
    if (!userId) return null;
    return users.find(user => user.id === userId);
  };

  const assignedUser = getUserById(task.assignedTo ?? undefined);

  // Get appropriate badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex rounded-full bg-warning-100 px-2 py-1 text-xs font-medium text-warning-800 dark:bg-warning-900 dark:text-warning-200">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex rounded-full bg-success-100 px-2 py-1 text-xs font-medium text-success-800 dark:bg-success-900 dark:text-success-200">
            Completed
          </span>
        );
      case "not_started":
        return (
          <span className="inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            Not Started
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex rounded-full bg-error-100 px-2 py-1 text-xs font-medium text-error-800 dark:bg-error-900 dark:text-error-200">
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-700">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{task.title}</h3>
        {getStatusBadge(task.status)}
      </div>
      <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>Assigned to: </span>
        <span className="font-medium">
          {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "Unassigned"}
        </span>
      </div>
      <div className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
        <span>Due: </span>
        <span className="font-medium">
          {task.dueDate 
            ? format(new Date(task.dueDate), "MMM d, yyyy, h:mm a")
            : "No due date"}
        </span>
      </div>
      
      {task.description && (
        <div className="mb-3 rounded-md bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <p className="text-xs text-neutral-600 dark:text-neutral-300">{task.description}</p>
        </div>
      )}
      
      {/* If it's the HVAC task, show the sample photos */}
      {task.id === 1 && (
        <div className="mb-3">
          <h4 className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">Photos (2)</h4>
          <div className="flex items-center space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
              alt="HVAC system inspection" 
              className="h-16 w-16 rounded object-cover" 
            />
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
              alt="Technician working" 
              className="h-16 w-16 rounded object-cover" 
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Add Note
          </Button>
          <Button variant="outline" size="sm" className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Upload Photo
          </Button>
        </div>
        <Link href={`/tasks/${task.id}`}>
          <Button 
            size="sm"
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium text-white",
              task.status === "completed" 
                ? "bg-neutral-500 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-700"
                : task.status === "not_started"
                ? "bg-primary-500 hover:bg-primary-600"
                : "bg-success-500 hover:bg-success-600"
            )}
          >
            {task.status === "completed" 
              ? "View Details" 
              : task.status === "not_started"
              ? "Start Task"
              : "Mark Complete"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
