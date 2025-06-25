import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Employees from "@/pages/employees";
import Attendance from "@/pages/attendance";
import Tasks from "@/pages/tasks";
import EmployeeDetail from "@/pages/employee-detail";
import TaskDetail from "@/pages/task-detail";
import Login from "@/pages/login";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/app-layout";
function Router() {
    var _a = useAuth(), user = _a.user, isLoading = _a.isLoading;
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    if (!user) {
        return (<Switch>
        <Route path="*" component={Login}/>
      </Switch>);
    }
    return (<AppLayout>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/employees" component={Employees}/>
        <Route path="/employees/:id" component={EmployeeDetail}/>
        <Route path="/attendance" component={Attendance}/>
        <Route path="/tasks" component={Tasks}/>
        <Route path="/tasks/:id" component={TaskDetail}/>
        <Route component={NotFound}/>
      </Switch>
    </AppLayout>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
