import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface EmployeeTableProps {
  users: User[];
}

const EmployeeTable = ({ users }: EmployeeTableProps) => {
  // Filter out any admin users for display in employee table
  const employees = users.filter(user => user.role !== 'admin');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Team Members</h2>
        <Link href="/employees">
          <Button className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
            Add Employee
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Tasks</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Last Activity</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center">
                    <img 
                      src={employee.profileImageUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`} 
                      alt="Employee profile" 
                      className="h-10 w-10 rounded-full object-cover" 
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {employee.position}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                    employee.id !== 6 
                      ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200" 
                      : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                  )}>
                    {employee.id !== 6 ? "Active" : "Offline"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {employee.id === 2 ? "3 Active" : 
                   employee.id === 3 ? "2 Active" : 
                   employee.id === 4 ? "1 Active" : 
                   employee.id === 5 ? "2 Active" : "0 Active"}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {employee.id === 2 ? "5 minutes ago" : 
                   employee.id === 3 ? "15 minutes ago" : 
                   employee.id === 4 ? "45 minutes ago" : 
                   employee.id === 5 ? "30 minutes ago" : "Yesterday"}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                  <Link href={`/employees/${employee.id}`}>
                    <Button variant="link" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
