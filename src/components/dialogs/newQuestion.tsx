"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { PutBlobResult } from "@vercel/blob";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  entry_function: z.string(),
  io_input: z.string(),
  func_args: z.string(),
});

export default function NewQuestionForm({ courseId }: { courseId: string }): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const inputRefFileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      language: "",
      entry_function: "main",
      io_input: "[]",
      func_args: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      if (!inputRefFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const refFile = inputRefFileRef.current.files[0];
      const response = await fetch(
        `/api/upload/program?filename=${refFile.name}`,
        {
          method: "POST",
          body: refFile,
        }
      );

      if (!response.ok) {
        const message = (await response.json()).error;
        throw new Error(message);
      }

      const newBlob = (await response.json()) as PutBlobResult;
      const res = await fetch("/api/upload/question", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          courseId: courseId,
          reference_program: newBlob.url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const message = (await res.json()).error;
        throw new Error(message);
      }
      setOpen(false);
      toast({
        title: "New Question Created",
        variant: "success",
      });
      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error Creating New Question",
        description: error.message,
        variant: "destructive",
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new question</DialogTitle>
          <DialogDescription>
            Ensure all question parameters are set correctly
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programming Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={form.formState.isSubmitting}>
                        <SelectValue placeholder="Select a programming languange" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="py">Python</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Upload Reference Solution</FormLabel>
              <FormControl>
                <Input name="file" ref={inputRefFileRef} type="file" />
              </FormControl>
              <FormDescription>
                Upload a file containing the reference solution
              </FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="entry_function"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Function</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="io_input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IO Inputs</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="func_args"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Function Arguments</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
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
              Submit
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
