"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface NewAnnouncementDialogProps {
  user: User;
  course_id: string;
}

const formSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export default function NewAnnouncementDialog({ user, course_id }: NewAnnouncementDialogProps): React.JSX.Element {
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

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
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
          requestor_email: user.email,
          course_id: course_id, 
          title: values.title,
          body: values.body,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (res.ok) {
        toast({
          title: "New Announcement Created",
          variant: "success",
        });
        form.reset();
        setOpen(false);
        router.refresh()
      } else {
        const errorResponse = await res.json();
        toast({
          title: "New Announcement Failed",
          description: errorResponse.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "New Announcement Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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

