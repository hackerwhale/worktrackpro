import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertNoteSchema } from "@shared/schema";
// Extend the insert schema for our form needs
var noteFormSchema = insertNoteSchema
    .omit({ taskId: true, userId: true }) // These will be set by the backend
    .extend({
    content: z.string().min(1, "Note content is required"),
});
var NoteForm = function (_a) {
    var taskId = _a.taskId, onSuccess = _a.onSuccess;
    var toast = useToast().toast;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var form = useForm({
        resolver: zodResolver(noteFormSchema),
        defaultValues: {
            content: "",
        },
    });
    var addNoteMutation = useMutation({
        mutationFn: function (data) {
            return apiRequest("POST", "/api/tasks/".concat(taskId, "/notes"), data);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks/".concat(taskId, "/notes")] });
            toast({
                title: "Note added",
                description: "Your note has been added to the task",
            });
            form.reset();
            if (onSuccess)
                onSuccess();
        },
        onError: function (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to add note",
            });
        },
        onSettled: function () {
            setIsSubmitting(false);
        }
    });
    var onSubmit = function (data) {
        setIsSubmitting(true);
        addNoteMutation.mutate(data);
    };
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="content" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormControl>
                <Textarea placeholder="Add a note..." className="min-h-[80px] resize-none" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </form>
    </Form>);
};
export default NoteForm;
