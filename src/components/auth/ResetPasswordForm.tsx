"use client";

import React from "react";
import { Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function ResetPasswordForm(): React.JSX.Element {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          token: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const message = (await res.json()).error;
        throw new Error(message);
      }
      toast({
        title: "Password Reset Success",
        description: "Your password has been updated. Redirecting to sign-in",
        variant: "success",
      });

      setTimeout(() => {
        signIn(undefined, { callbackUrl: "/" });
      }, 3000);
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="flex space-x-2 items-center">
                  <Lock />
                  <Input
                    type="password"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
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
            Change Password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
