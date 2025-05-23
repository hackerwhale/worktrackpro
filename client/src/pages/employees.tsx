import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, CheckSquare } from "lucide-react";
import AddEmployeeForm from "@/components/forms/add-employee-form";

const Employees = () => {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const filteredUsers = users?.filter(user => 
    user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    user.position?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Employees</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Employee</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search employees..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers?.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800">
                <div className="absolute -bottom-10 left-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white dark:border-gray-800">
                    <img 
                      src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardContent className="pt-12">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.position}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckSquare className="mr-1 h-3 w-3" />
                    Active
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <Link href={`/employees/${user.id}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
