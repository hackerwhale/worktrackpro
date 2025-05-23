import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Attendance } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import AttendanceForm from "@/components/forms/attendance-form";

const AttendancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [tab, setTab] = useState<string>("daily");

  const formattedDate = format(date, "yyyy-MM-dd");

  // Get all users
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Get attendance data for selected date
  const { data: attendanceData, isLoading } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance", { date: formattedDate }],
  });

  // Check in mutation
  const checkInMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/attendance/check-in", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Checked in successfully",
        description: `You've checked in at ${format(new Date(), "h:mm a")}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to check in",
        description: error.message,
      });
    },
  });

  // Check out mutation
  const checkOutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/attendance/check-out", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Checked out successfully",
        description: `You've checked out at ${format(new Date(), "h:mm a")}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive", 
        title: "Failed to check out",
        description: error.message,
      });
    },
  });

  // Current user's attendance for today
  const currentUserAttendance = attendanceData?.find(
    a => a.userId === user?.id && a.date === formattedDate
  );

  // Helper function to get user by ID
  const getUserById = (userId: number) => {
    return users?.find(u => u.id === userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Attendance</h1>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {!currentUserAttendance ? (
            <Button
              className="gap-2"
              onClick={() => checkInMutation.mutate()}
              disabled={checkInMutation.isPending}
            >
              <UserCheck className="h-4 w-4" />
              Check In
            </Button>
          ) : (
            <Button
              className="gap-2"
              variant="outline"
              onClick={() => checkOutMutation.mutate()}
              disabled={checkOutMutation.isPending || !!currentUserAttendance.checkOutTime}
            >
              <UserX className="h-4 w-4" />
              Check Out
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="daily" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="employees">By Employee</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance for {format(date, "MMMM d, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users?.map(employee => {
                    const attendance = attendanceData?.find(a => a.userId === employee.id && a.date === formattedDate);
                    
                    return (
                      <div key={employee.id} className="flex items-center rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
                        <img 
                          src={employee.profileImageUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`} 
                          alt={`${employee.firstName} ${employee.lastName}`} 
                          className="h-10 w-10 rounded-full object-cover" 
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">{employee.firstName} {employee.lastName}</p>
                          <div className="flex items-center text-xs text-neutral-500">
                            {attendance ? (
                              <div className="flex gap-2">
                                <span className="inline-block rounded-full bg-success-100 px-2 py-1 text-success-800 dark:bg-success-900 dark:text-success-300">
                                  Checked in: {format(new Date(attendance.checkInTime), "h:mm a")}
                                </span>
                                {attendance.checkOutTime && (
                                  <span className="inline-block rounded-full bg-neutral-100 px-2 py-1 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                                    Checked out: {format(new Date(attendance.checkOutTime), "h:mm a")}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-block rounded-full bg-neutral-100 px-2 py-1 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                                Not checked in
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          {attendance?.status === "active" && (
                            <span className="inline-flex rounded-full bg-success-100 px-2 py-1 text-xs font-medium text-success-800 dark:bg-success-900 dark:text-success-300">Active</span>
                          )}
                          {attendance?.status === "break" && (
                            <span className="inline-flex rounded-full bg-warning-100 px-2 py-1 text-xs font-medium text-warning-800 dark:bg-warning-900 dark:text-warning-300">On Break</span>
                          )}
                          {attendance?.status === "offline" || !attendance && (
                            <span className="inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">Offline</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceForm users={users || []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">Coming soon: Weekly attendance reports and analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendancePage;
