import { Calendar } from "lucide-react";
import { format } from "date-fns";
var AttendanceList = function (_a) {
    var attendance = _a.attendance, users = _a.users;
    var today = new Date().toISOString().split('T')[0];
    var todaysAttendance = attendance.filter(function (record) { return record.date === today; });
    // Helper function to get user by ID
    var getUserById = function (userId) {
        return users.find(function (user) { return user.id === userId; });
    };
    return (<div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Today's Attendance</h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          <Calendar className="inline h-4 w-4"/>
          <span className="ml-1">Today</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {users.filter(function (user) { return user.role !== 'admin'; }).map(function (employee) {
            var record = todaysAttendance.find(function (a) { return a.userId === employee.id; });
            return (<div key={employee.id} className="flex items-center rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
              <img src={employee.profileImageUrl || "https://ui-avatars.com/api/?name=".concat(employee.firstName, "+").concat(employee.lastName)} alt="Employee profile" className="h-10 w-10 rounded-full object-cover"/>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {employee.firstName} {employee.lastName}
                </p>
                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                  {record ? (<span className="inline-block rounded-full bg-success-100 px-2 py-1 text-success-800 dark:bg-success-900 dark:text-success-200">
                      Checked in: {format(new Date(record.checkInTime), 'hh:mm a')}
                    </span>) : (<span className="inline-block rounded-full bg-neutral-100 px-2 py-1 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                      Not checked in
                    </span>)}
                </div>
              </div>
            </div>);
        })}
      </div>
    </div>);
};
export default AttendanceList;
