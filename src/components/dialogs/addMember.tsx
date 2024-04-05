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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  emails: z.string(),
});

export default function AddMemberDialog({
  user,
  course,
}: {
  user: User;
  course: Course;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!values.emails.trim()) {
        throw new Error("Email field cannot be empty!");
      }
      const res = await fetch("/api/course-management/add-to-course", {
        method: "POST",
        body: JSON.stringify({
          requestorEmail: user.email,
          courseId: course.id,
          emailsToAdd: values.emails.split(","),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resBody = await res.json();
      if (resBody.status == "error") {
        throw new Error(resBody.message);
      } else {
        toast({
          title: "New Members Added",
          variant: "success",
        });
        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 1000); // 1-second delay
      }
    } catch (error) {
      toast({
        title: "Error Adding New Members",
        description: error.message,
        variant: "destructive",
      });
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
