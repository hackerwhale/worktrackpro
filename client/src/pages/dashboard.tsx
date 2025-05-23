import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/stats-card";
import EmployeeTable from "@/components/dashboard/employee-table";
import AttendanceList from "@/components/dashboard/attendance-list";
import ActivityTimeline from "@/components/dashboard/activity-timeline";
import TaskCard from "@/components/dashboard/task-card";
import { User, Task, Attendance, Activity } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { UsersIcon, CheckSquareIcon, ClockIcon, AlertTriangleIcon } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: user?.role === "admin",
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: attendance } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
  });

  const { data: recentTasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks/recent"],
  });

  // Get counts for stats cards
  const totalEmployees = users?.length || 0;
  const checkedInToday = attendance?.filter(a => !a.checkOutTime).length || 0;
  const pendingTasks = tasks?.filter(t => t.status === "in_progress").length || 0;
  const overdueTasks = tasks?.filter(t => {
    if (t.status !== "completed" && t.dueDate) {
      return new Date(t.dueDate) < new Date();
    }
    return false;
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Employees"
            value={totalEmployees.toString()}
            icon={<UsersIcon />}
            color="primary"
          />
          
          <StatsCard 
            title="Checked In Today"
            value={checkedInToday.toString()}
            icon={<CheckSquareIcon />}
            color="success"
          />
          
          <StatsCard 
            title="Pending Tasks"
            value={pendingTasks.toString()}
            icon={<ClockIcon />}
            color="warning"
          />
          
          <StatsCard 
            title="Overdue Tasks"
            value={overdueTasks.toString()}
            icon={<AlertTriangleIcon />}
            color="error"
          />
        </div>
      </div>
      
      {/* Team & Attendance Section */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Team Members */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm dark:bg-card">
          <EmployeeTable users={users || []} />
        </div>
        
        {/* Today's Attendance */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card">
          <AttendanceList attendance={attendance || []} users={users || []} />
        </div>
      </div>
      
      {/* Recent Activity & Tasks */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="col-span-1 rounded-lg bg-white p-6 shadow-sm dark:bg-card">
          <ActivityTimeline activities={activities || []} users={users || []} />
        </div>
        
        {/* Tasks */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm dark:bg-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Recent Tasks</h2>
            <button className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
              Assign New Task
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTasks?.map(task => (
              <TaskCard key={task.id} task={task} users={users || []} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
