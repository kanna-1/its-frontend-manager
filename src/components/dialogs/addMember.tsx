"use client";

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setErrorMap, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Course, User } from "@prisma/client";
import { useState, useEffect } from 'react';

const formSchema = z.object({
  emails: z.string()
});


export default function AddMemberDialog({ user, course }: { user: User, course: Course }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Clears the success and error when dialog opens
  useEffect(() => {
    if (open) {
      setError('');
      setSuccess(false);
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError('');
      setSuccess(false);
      setSubmitting(true);
      if (!values.emails.trim()) {
        setError("Email field cannot be empty!")
        return
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
      if (resBody.status == 'error') {
        setError(resBody.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 2000); // 2-second delay
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false)
    }
  }
  return (
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent>

      {error && (
        <p
          style={{
            backgroundColor: "#ffcccc",
            fontWeight: "500",
            color: "red",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}
      {success && (
        <p
          style={{
            backgroundColor: "#ccffcc",
            fontWeight: "500",
            color: "green",
            padding: "10px",
            textAlign: 'center',
            borderRadius: "5px",
            marginBottom: "10px",
            fontSize: "10px",
          }}
        >
          Student(s) successfully added!
        </p>
      )}

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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Please comma separate the emails without space</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
