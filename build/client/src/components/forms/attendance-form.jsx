import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
var AttendanceForm = function (_a) {
    var users = _a.users;
    var toast = useToast().toast;
    var today = new Date().toISOString().split('T')[0];
    // Get attendance data for selected date
    var _b = useQuery({
        queryKey: ["/api/attendance", { date: today }],
    }), attendanceData = _b.data, isLoading = _b.isLoading;
    // Status update mutation
    var updateStatusMutation = useMutation({
        mutationFn: function (data) {
            return apiRequest("PUT", "/api/attendance/status", data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
            toast({
                title: "Status updated",
                description: "Your attendance status has been updated",
            });
        },
        onError: function (error) {
            toast({
                variant: "destructive",
                title: "Failed to update status",
                description: error.message,
            });
        },
    });
    // Helper to get status display info
    var getStatusDisplay = function (status) {
        switch (status) {
            case "active":
                return { label: "Active", className: "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300" };
            case "break":
                return { label: "On Break", className: "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300" };
            case "offline":
                return { label: "Offline", className: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300" };
            default:
                return { label: "Unknown", className: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300" };
        }
    };
    // Get employee attendance
    var getEmployeeAttendance = function (userId) {
        return attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.find(function (a) { return a.userId === userId && a.date === today; });
    };
    return (<div className="space-y-4">
      {isLoading ? (<div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        </div>) : (<div>
          {users.filter(function (user) { return user.role === "employee"; }).map(function (employee) {
                var attendance = getEmployeeAttendance(employee.id);
                var status = (attendance === null || attendance === void 0 ? void 0 : attendance.status) || "offline";
                var statusDisplay = getStatusDisplay(status);
                return (<Card key={employee.id} className="mb-4">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <img src={employee.profileImageUrl || "https://ui-avatars.com/api/?name=".concat(employee.firstName, "+").concat(employee.lastName)} alt={"".concat(employee.firstName, " ").concat(employee.lastName)} className="h-10 w-10 rounded-full object-cover"/>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{employee.firstName} {employee.lastName}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                        {attendance ? (<>
                            <span>Checked in: {format(new Date(attendance.checkInTime), 'h:mm a')}</span>
                            {attendance.checkOutTime && (<span>Checked out: {format(new Date(attendance.checkOutTime), 'h:mm a')}</span>)}
                          </>) : (<span>Not checked in today</span>)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusDisplay.className}>
                      {statusDisplay.label}
                    </Badge>
                    
                    {attendance && !attendance.checkOutTime && (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            Change Status
                            <ChevronDown className="h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={function () { return updateStatusMutation.mutate({ status: "active" }); }}>
                            Active
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={function () { return updateStatusMutation.mutate({ status: "break" }); }}>
                            On Break
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>)}
                  </div>
                </CardContent>
              </Card>);
            })}
        </div>)}
    </div>);
};
export default AttendanceForm;
