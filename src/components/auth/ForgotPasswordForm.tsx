"use client";

import React from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export function ForgotPasswordForm() : React.JSX.Element {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
    console.log("SUBMITTED")
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast({
          title: "Login Success",
          description: "Welcome back!",
          variant: "success",
        });
        console.log("OK")
        signIn(undefined, { callbackUrl: "/" }); 
      } else {
        const message = (await res.json()).error;
        throw new Error(message);
      }
    } catch (error) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="flex space-x-2 items-center">
                  <Mail />
                  <Input disabled={form.formState.isSubmitting} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full justify-center items-center text-center">
          <LoadingButton
            type="submit"
            className="w-3/4 mt-4"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
