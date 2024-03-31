"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, object, string, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginUserInput = TypeOf<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = "/courses";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });

      setSubmitting(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        reset({ password: "" });
        const message = "Invalid email or password";
        setError(message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
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
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your email</FormLabel>
              <FormControl>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  <Mail size={30} style={{ marginRight: 8 }} />
                  <Input
                    style={{ width: "500px" }}
                    placeholder="e.g. john@doe.com"
                    {...register("email")}
                  />
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
              <FormLabel>Your password</FormLabel>
              <FormControl>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  <Lock size={18} style={{ marginRight: 8 }} />
                  <Input
                    type="password"
                    placeholder="e.g. password123"
                    {...register("password")}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div style={{ textAlign: "right", paddingBottom: 5, paddingTop: 5 }}>
          <a href="/forgot-password" style={{ fontSize: 9 }}>
            Forgot Password?
          </a>
        </div>

        <div style={{ textAlign: "center", paddingBottom: 15, paddingTop: 5 }}>
          <Button
            type="submit"
            style={{ width: 200, borderRadius: 10 }}
            disabled={submitting}
          >
            Login
          </Button>
        </div>
      </form>

      <hr style={{ borderColor: "gray" }} />
    </Form>
  );
}
