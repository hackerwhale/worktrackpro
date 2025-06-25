var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
// Extend the insert schema with additional validation
var employeeSchema = insertUserSchema.extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine(function (data) { return data.password === data.confirmPassword; }, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});
var AddEmployeeForm = function (_a) {
    var onSuccess = _a.onSuccess;
    var toast = useToast().toast;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var form = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            email: "",
            position: "",
            role: "employee",
        },
    });
    var createEmployeeMutation = useMutation({
        mutationFn: function (data) {
            return apiRequest("POST", "/api/users", data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/users"] });
            toast({
                title: "Success",
                description: "Employee added successfully",
            });
            onSuccess();
        },
        onError: function (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to add employee",
            });
        },
        onSettled: function () {
            setIsSubmitting(false);
        }
    });
    var onSubmit = function (data) {
        setIsSubmitting(true);
        // Remove the confirmPassword field before sending to API
        var confirmPassword = data.confirmPassword, submitData = __rest(data, ["confirmPassword"]);
        createEmployeeMutation.mutate(submitData);
    };
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={form.control} name="firstName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>);
        }}/>
          <FormField control={form.control} name="lastName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>);
        }}/>
        </div>

        <FormField control={form.control} name="email" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} value={(_b = field.value) !== null && _b !== void 0 ? _b : ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <FormField control={form.control} name="position" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Job position" {...field} value={(_b = field.value) !== null && _b !== void 0 ? _b : ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <FormField control={form.control} name="username" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username for login" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={form.control} name="password" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Set password" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>);
        }}/>
          <FormField control={form.control} name="confirmPassword" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm password" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>);
        }}/>
        </div>

        <FormField control={form.control} name="role" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>);
        }}/>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onSuccess} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </Form>);
};
export default AddEmployeeForm;
