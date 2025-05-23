import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Filter, Search, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Task, User } from "@shared/schema";
import { format } from "date-fns";
import CreateTaskForm from "@/components/forms/create-task-form";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Filter tasks based on search term and status filter
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return (
          <Badge variant="outline" className="gap-1 text-neutral-500">
            <Clock className="h-3 w-3" />
            Not Started
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="gap-1 bg-warning-50 text-warning-600 dark:bg-warning-900 dark:text-warning-300">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="gap-1 bg-success-50 text-success-600 dark:bg-success-900 dark:text-success-300">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="outline" className="gap-1 bg-error-50 text-error-600 dark:bg-error-900 dark:text-error-300">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  const getAssignedUserName = (userId?: number) => {
    if (!userId) return "Unassigned";
    const user = users?.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const getAssignedUserAvatar = (userId?: number) => {
    if (!userId) return null;
    const user = users?.find(u => u.id === userId);
    return user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Low</Badge>;
      case "medium":
        return <Badge className="bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300">Medium</Badge>;
      case "high":
        return <Badge className="bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300">High</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Tasks</h1>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <CreateTaskForm onSuccess={() => setShowCreateDialog(false)} users={users || []} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {statusFilter ? `Filter: ${statusFilter.replace('_', ' ')}` : 'Filter by Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("not_started")}>
              Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>
              Overdue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                  <AlertTriangle className="h-6 w-6 text-neutral-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No Tasks Found</h3>
                <p className="mt-2 text-center text-sm text-neutral-500">
                  There are no tasks matching your current filters. Try changing your search or creating a new task.
                </p>
                <Button className="mt-4 gap-2" onClick={() => setShowCreateDialog(true)}>
                  <PlusCircle className="h-4 w-4" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks?.map(task => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 border-b p-4 md:border-b-0 md:border-r">
                      <div className="mb-2 flex items-center justify-between">
                        <Link href={`/tasks/${task.id}`} className="text-lg font-medium hover:text-primary-600 hover:underline">
                          {task.title}
                        </Link>
                        {getTaskStatusBadge(task.status)}
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                        {task.description || "No description provided"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Due:</span>
                          <span className="text-xs font-medium">
                            {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Priority:</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between p-4 md:w-64">
                      <div className="flex items-center gap-3">
                        {task.assignedTo && getAssignedUserAvatar(task.assignedTo) && (
                          <img 
                            src={getAssignedUserAvatar(task.assignedTo) || ""} 
                            alt={getAssignedUserName(task.assignedTo)} 
                            className="h-10 w-10 rounded-full object-cover" 
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{getAssignedUserName(task.assignedTo)}</p>
                          <p className="text-xs text-neutral-500">
                            Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Link href={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
