"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface NewAnnouncementDialogProps {
  user: User;
  courseId: string;
}

const formSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export default function NewAnnouncementDialog({ user, courseId }: NewAnnouncementDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!values.title.trim()) {
        throw new Error("Announcement title cannot be empty.");
      }
      if (!values.body.trim()) {
        throw new Error("Announcement body cannot be empty.");
      }
      const res = await fetch("/api/course-management/add-announcement", {
        method: "POST",
        body: JSON.stringify({
          requestorEmail: user.email,
          courseId: courseId, 
          title: values.title,
          body: values.body,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const resBody = await res.json(); //point of error
      if (resBody.announcement) {
        toast({
          title: "New Announcement Created",
          variant: "success",
        });
        setOpen(false); // Close the dialog after successful creation
      }
    } catch (error) {
      console.error('Error occurrede:', error.message);
      toast({
        title: "Error Creating New Announcement",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>New Announcement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new announcement</DialogTitle>
          <DialogDescription>
            Please enter the announcement details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Body</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={5}
                      disabled={form.formState.isSubmitting}
                      className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

