var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var photoFormSchema = z.object({
    caption: z.string().optional(),
    photo: z.instanceof(File, { message: "Please select a photo to upload" }).nullable(),
});
var PhotoUpload = function (_a) {
    var taskId = _a.taskId, onSuccess = _a.onSuccess;
    var toast = useToast().toast;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var _c = useState(null), previewUrl = _c[0], setPreviewUrl = _c[1];
    var fileInputRef = useRef(null);
    var form = useForm({
        resolver: zodResolver(photoFormSchema),
        defaultValues: {
            caption: "",
        },
    });
    var uploadPhotoMutation = useMutation({
        mutationFn: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var formData, response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        if (data.photo) {
                            formData.append("photo", data.photo);
                        }
                        if (data.caption)
                            formData.append("caption", data.caption);
                        return [4 /*yield*/, fetch("/api/tasks/".concat(taskId, "/photos"), {
                                method: "POST",
                                body: formData,
                                credentials: "include",
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error(errorText || response.statusText);
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/tasks/".concat(taskId, "/photos")] });
            toast({
                title: "Photo uploaded",
                description: "Your photo has been added to the task",
            });
            form.reset();
            setPreviewUrl(null);
            if (onSuccess)
                onSuccess();
        },
        onError: function (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to upload photo",
            });
        },
        onSettled: function () {
            setIsSubmitting(false);
        }
    });
    var onSubmit = function (data) {
        setIsSubmitting(true);
        uploadPhotoMutation.mutate(data);
    };
    var handleFileChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            form.setValue("photo", file, { shouldValidate: true });
            // Create preview URL
            var url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };
    var clearFileSelection = function () {
        form.setValue("photo", null, { shouldValidate: true });
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="photo" render={function (_a) {
            var _b = _a.field, value = _b.value, onChange = _b.onChange, field = __rest(_b, ["value", "onChange"]);
            return (<FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-2">
                  <div className={cn("flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-primary-600 dark:hover:bg-primary-900/50", previewUrl && "border-primary-300 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/50")} onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }}>
                    {previewUrl ? (<>
                        <div className="relative h-full w-full">
                          <img src={previewUrl} alt="Preview" className="h-full max-h-full w-full max-w-full rounded object-contain"/>
                          <button type="button" className="absolute right-0 top-0 rounded-full bg-error-100 p-1 text-error-600 shadow dark:bg-error-900 dark:text-error-300" onClick={function (e) {
                        e.stopPropagation();
                        clearFileSelection();
                    }}>
                            <X className="h-4 w-4"/>
                          </button>
                        </div>
                      </>) : (<>
                        <Upload className="mb-2 h-8 w-8 text-neutral-400"/>
                        <p className="text-center text-sm text-neutral-500">
                          Click to upload a photo or drag and drop here
                        </p>
                      </>)}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} {...field}/>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <FormField control={form.control} name="caption" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
              <FormLabel>Caption (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Add a caption to the photo" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>);
        }}/>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !form.getValues("photo")}>
            {isSubmitting ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>
      </form>
    </Form>);
};
export default PhotoUpload;
