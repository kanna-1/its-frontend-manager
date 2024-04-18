"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Course, User } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  emails: z.string(),
});

export default function AddMemberDialog({
  user,
  course,
}: {
  user: User;
  course: Course;
}): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      if (!values.emails.trim()) {
        throw new Error("Email field cannot be empty!");
      }
      const res = await fetch("/api/course-management/add-to-course", {
        method: "POST",
        body: JSON.stringify({
          requestor_email: user.email,
          course_id: course.id,
          emails_to_add: values.emails.split(","),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast({
          title: "New Members Added",
          variant: "success",
        });
        setOpen(false);
        router.refresh();
      } else {
        const error_response = await res.json();
        toast({
          title: "Error Adding New Members",
          description: error_response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Adding New Members",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      form.reset();
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new members</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New member emails</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Please comma separate the emails without space
                  </FormDescription>
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
