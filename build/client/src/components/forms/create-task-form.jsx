var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertTaskSchema } from "@shared/schema";
// Extend the insert schema for our form needs
var taskFormSchema = insertTaskSchema
    .omit({ createdBy: true }) // This will be set by the backend
    .extend({
    dueDate: z.date().optional(),
});
var CreateTaskForm = function (_a) {
    var onSuccess = _a.onSuccess, users = _a.users;
    var toast = useToast().toast;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    // Filter out admin users for assignment
    var employees = users.filter(function (user) { return user.role === "employee"; });
    var form = useForm({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "not_started",
            priority: "medium",
        },
    });
    var createTaskMutation = useMutation({
        mutationFn: function (data) {
            return apiRequest("POST", "/api/tasks", data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
            toast({
                title: "Success",
                description: "Task created successfully",
            });
            onSuccess();
        },
        onError: function (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create task",
            });
        },
        onSettled: function () {
            setIsSubmitting(false);
        }
    });
    var onSubmit = function (data) {
        setIsSubmitting(true);
        // Convert assignedTo to a number if it exists
        var formattedData = __assign(__assign({}, data), { assignedTo: data.assignedTo ? parseInt(data.assignedTo.toString()) : undefined });
        createTaskMutation.mutate(formattedData);
    };
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <FormField control={form.control} name="description" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" className="min-h-[100px]" {...field} value={(_b = field.value) !== null && _b !== void 0 ? _b : ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={form.control} name="assignedTo" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select onValueChange={field.onChange} value={(_b = field.value) === null || _b === void 0 ? void 0 : _b.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map(function (employee) { return (<SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>); })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>);
        }}/>

          <FormField control={form.control} name="dueDate" render={function (_a) {
            var field = _a.field;
            return (<FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>);
        }}/>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={form.control} name="priority" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>);
        }}/>

          <FormField control={form.control} name="status" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>);
        }}/>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onSuccess} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>);
};
export default CreateTaskForm;
