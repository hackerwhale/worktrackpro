import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Task, User, Note, Photo } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  ClipboardList, 
  MessageSquare, 
  Image, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NoteForm from "@/components/forms/note-form";
import PhotoUpload from "@/components/forms/photo-upload";
import CreateTaskForm from "@/components/forms/create-task-form";

const TaskDetail = () => {
  const [, params] = useRoute("/tasks/:id");
  const taskId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: task, isLoading: taskLoading } = useQuery<Task>({
    queryKey: [`/api/tasks/${taskId}`],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: notes } = useQuery<Note[]>({
    queryKey: [`/api/tasks/${taskId}/notes`],
    enabled: !!taskId,
  });

  const { data: photos } = useQuery<Photo[]>({
    queryKey: [`/api/tasks/${taskId}/photos`],
    enabled: !!taskId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => 
      apiRequest("PUT", `/api/tasks/${taskId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${taskId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Task status has been updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update task",
      });
    },
  });

  // Helper to get user by ID
  const getUserById = (userId?: number) => {
    if (!userId) return null;
    return users?.find(user => user.id === userId);
  };

  const assignedUser = task?.assignedTo ? getUserById(task.assignedTo) : null;
  const createdByUser = task?.createdBy ? getUserById(task.createdBy) : null;

  // Helper to format the due date with time
  const formatDueDate = (date?: string | Date | null) => {
    if (!date) return "No due date";
    return format(new Date(date), "MMM d, yyyy, h:mm a");
  };

  // Get appropriate badge based on status
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "not_started":
        return (
          <Badge className="gap-1 bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <Clock className="h-3 w-3" />
            Not Started
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="gap-1 bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="gap-1 bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="gap-1 bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to format the created/updated dates
  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    return format(new Date(date), "MMM d, yyyy, h:mm a");
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  const getStatusActionButton = () => {
    if (!task) return null;
    
    switch (task.status) {
      case "not_started":
        return (
          <Button 
            onClick={() => handleStatusChange("in_progress")}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Start Task
          </Button>
        );
      case "in_progress":
        return (
          <Button 
            onClick={() => handleStatusChange("completed")}
            className="gap-2 bg-success-500 hover:bg-success-600"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Complete
          </Button>
        );
      case "completed":
        return (
          <Button 
            onClick={() => handleStatusChange("in_progress")}
            variant="outline"
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Reopen Task
          </Button>
        );
      default:
        return null;
    }
  };

  if (taskLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="rounded-full bg-error-100 p-3 dark:bg-error-900">
          <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Task Not Found</h3>
        <p className="mt-2 text-center text-sm text-neutral-500">
          The task you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/tasks">
          <Button className="mt-4">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/tasks">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">{task.title}</h1>
            <div className="flex items-center gap-2">
              {getStatusBadge(task.status)}
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Created {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm 
                onSuccess={() => setShowEditDialog(false)} 
                users={users || []} 
              />
            </DialogContent>
          </Dialog>
          
          {getStatusActionButton()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedUser ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={assignedUser.profileImageUrl || `https://ui-avatars.com/api/?name=${assignedUser.firstName}+${assignedUser.lastName}`} 
                    alt={`${assignedUser.firstName} ${assignedUser.lastName}`} 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                  <div>
                    <p className="font-medium">{assignedUser.firstName} {assignedUser.lastName}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{assignedUser.position}</p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">Not assigned to anyone</p>
              )}
              
              <div className="space-y-1 pt-2">
                <div className="flex items-start gap-2">
                  <CalendarIcon className="mt-0.5 h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDueDate(task.dueDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <ClipboardList className="mt-0.5 h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="capitalize text-sm text-neutral-500 dark:text-neutral-400">
                      {task.priority}
                    </p>
                  </div>
                </div>
                
                {createdByUser && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 h-4 w-4 text-neutral-500">👤</div>
                    <div>
                      <p className="text-sm font-medium">Created By</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {createdByUser.firstName} {createdByUser.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-neutral-50 p-4 dark:bg-neutral-800/50">
              {task.description ? (
                <p className="text-neutral-800 dark:text-neutral-200">{task.description}</p>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">No description provided</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="photos" className="gap-2">
            <Image className="h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NoteForm taskId={taskId} />
                
                <div className="space-y-4 pt-4">
                  {notes && notes.length > 0 ? (
                    notes.map((note) => {
                      const noteUser = getUserById(note.userId);
                      return (
                        <div key={note.id} className="rounded-md border border-neutral-200 p-4 dark:border-neutral-700">
                          <div className="mb-2 flex items-center gap-2">
                            {noteUser && (
                              <img 
                                src={noteUser.profileImageUrl || `https://ui-avatars.com/api/?name=${noteUser.firstName}+${noteUser.lastName}`} 
                                alt={`${noteUser.firstName} ${noteUser.lastName}`} 
                                className="h-8 w-8 rounded-full object-cover" 
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {noteUser ? `${noteUser.firstName} ${noteUser.lastName}` : "Unknown User"}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {formatDate(note.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">{note.content}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-sm text-neutral-500">No notes have been added to this task.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PhotoUpload taskId={taskId} />
                
                <div className="grid gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3">
                  {photos && photos.length > 0 ? (
                    photos.map((photo) => {
                      const photoUser = getUserById(photo.userId);
                      return (
                        <div key={photo.id} className="overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
                          <img 
                            src={photo.imageUrl} 
                            alt={photo.caption || "Task photo"} 
                            className="aspect-video w-full object-cover" 
                          />
                          <div className="p-3">
                            {photo.caption && (
                              <p className="text-sm font-medium">{photo.caption}</p>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                              {photoUser && (
                                <img 
                                  src={photoUser.profileImageUrl || `https://ui-avatars.com/api/?name=${photoUser.firstName}+${photoUser.lastName}`} 
                                  alt={`${photoUser.firstName} ${photoUser.lastName}`} 
                                  className="h-5 w-5 rounded-full object-cover" 
                                />
                              )}
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Uploaded by {photoUser ? `${photoUser.firstName}` : "Unknown User"} • {formatDate(photo.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full">
                      <p className="text-center text-sm text-neutral-500">No photos have been added to this task.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetail;
