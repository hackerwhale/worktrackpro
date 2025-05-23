import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { User, Task, Attendance } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Phone, Mail, Calendar, Edit, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import TaskCard from "@/components/dashboard/task-card";

const EmployeeDetail = () => {
  const [, params] = useRoute("/employees/:id");
  const userId = parseInt(params?.id || "0");

  const { data: user, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: [`/api/tasks/user/${userId}`],
  });

  const { data: attendance } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance"],
  });

  const userAttendance = attendance?.filter(a => a.userId === userId);
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = userAttendance?.some(a => a.date === today);

  const activeTasksCount = tasks?.filter(t => t.status === "in_progress").length || 0;
  const completedTasksCount = tasks?.filter(t => t.status === "completed").length || 0;
  const overdueTasksCount = tasks?.filter(t => {
    if (t.status !== "completed" && t.dueDate) {
      return new Date(t.dueDate) < new Date();
    }
    return false;
  }).length || 0;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="rounded-full bg-error-100 p-3 dark:bg-error-900">
          <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Employee Not Found</h3>
        <p className="mt-2 text-center text-sm text-neutral-500">
          The employee you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <img 
              src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
              alt={`${user.firstName} ${user.lastName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-neutral-500">{user.position}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-neutral-500">Status</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium">
                {checkedInToday ? "Checked In" : "Not Checked In"}
              </span>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                checkedInToday 
                  ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300" 
                  : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
              }`}>
                {checkedInToday ? "Active" : "Inactive"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span className="text-neutral-500">Active Tasks</span>
              </div>
              <div className="mt-2 text-2xl font-semibold">{activeTasksCount}</div>
            </div>
            <div className="rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-neutral-500" />
                <span className="text-neutral-500">Completed Tasks</span>
              </div>
              <div className="mt-2 text-2xl font-semibold">{completedTasksCount}</div>
            </div>
            <div className="rounded-full bg-success-100 p-3 text-success-600 dark:bg-success-900 dark:text-success-300">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex flex-col">
                    <dt className="text-sm text-neutral-500">Email</dt>
                    <dd className="font-medium">{user.email || "No email provided"}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm text-neutral-500">Username</dt>
                    <dd className="font-medium">{user.username}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm text-neutral-500">Role</dt>
                    <dd className="font-medium capitalize">{user.role}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Tasks</span>
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      {activeTasksCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Tasks</span>
                    <span className="rounded-full bg-success-100 px-2 py-1 text-xs font-medium text-success-800 dark:bg-success-900 dark:text-success-300">
                      {completedTasksCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue Tasks</span>
                    <span className="rounded-full bg-error-100 px-2 py-1 text-xs font-medium text-error-800 dark:bg-error-900 dark:text-error-300">
                      {overdueTasksCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks && tasks.length > 0 ? (
                  tasks.slice(0, 3).map((task) => (
                    <TaskCard key={task.id} task={task} users={[user]} />
                  ))
                ) : (
                  <p className="text-center text-sm text-neutral-500">No tasks assigned to this employee.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assigned Tasks</CardTitle>
              <Button>Assign New Task</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard key={task.id} task={task} users={[user]} />
                  ))
                ) : (
                  <p className="text-center text-sm text-neutral-500">No tasks assigned to this employee.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {userAttendance && userAttendance.length > 0 ? (
                <div className="space-y-4">
                  {userAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
                      <div>
                        <p className="font-medium">{format(new Date(record.date), "MMMM d, yyyy")}</p>
                        <div className="flex gap-2 text-sm text-neutral-500">
                          <span>
                            Check in: {record.checkInTime ? format(new Date(record.checkInTime), "h:mm a") : "N/A"}
                          </span>
                          {record.checkOutTime && (
                            <span>
                              Check out: {format(new Date(record.checkOutTime), "h:mm a")}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        record.status === "active"
                          ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300"
                          : record.status === "break"
                          ? "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300"
                          : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-neutral-500">No attendance records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-neutral-500">Activity log feature coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
