import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const photoFormSchema = z.object({
  caption: z.string().optional(),
  photo: z.instanceof(File, { message: "Please select a photo to upload" }),
});

type PhotoFormValues = z.infer<typeof photoFormSchema>;

interface PhotoUploadProps {
  taskId: number;
  onSuccess?: () => void;
}

const PhotoUpload = ({ taskId, onSuccess }: PhotoUploadProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      caption: "",
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormValues) => {
      const formData = new FormData();
      formData.append("photo", data.photo);
      if (data.caption) formData.append("caption", data.caption);
      
      const response = await fetch(`/api/tasks/${taskId}/photos`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${taskId}/photos`] });
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to the task",
      });
      form.reset();
      setPreviewUrl(null);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload photo",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: PhotoFormValues) => {
    setIsSubmitting(true);
    uploadPhotoMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file, { shouldValidate: true });
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFileSelection = () => {
    form.setValue("photo", undefined, { shouldValidate: true });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photo"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className={cn(
                      "flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-primary-600 dark:hover:bg-primary-900/50",
                      previewUrl && "border-primary-300 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <>
                        <div className="relative h-full w-full">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="h-full max-h-full w-full max-w-full rounded object-contain" 
                          />
                          <button 
                            type="button"
                            className="absolute right-0 top-0 rounded-full bg-error-100 p-1 text-error-600 shadow dark:bg-error-900 dark:text-error-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFileSelection();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                        <p className="text-center text-sm text-neutral-500">
                          Click to upload a photo or drag and drop here
                        </p>
                      </>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Add a caption to the photo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !form.getValues("photo")}
          >
            {isSubmitting ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PhotoUpload;
