"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, LoadingButton } from "@/components/ui/button";
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
import { Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: "/courses",
      });

      if (!res?.error) {
        toast({
          title: "Login Success",
          description: "Welcome back!",
          variant: "success",
        });
        router.push("/courses");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login Error",
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
            Login
          </LoadingButton>
          <Link href="/forgot-password">
            <Button variant="link">Reset Password</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
