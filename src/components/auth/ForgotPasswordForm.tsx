"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { z, TypeOf, object, string } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState, useTransition  } from 'react';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Mail } from "lucide-react";

const formSchema = z.object({
    email: z.string(),
})

type ResetUserInput = TypeOf<typeof formSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: ""
      },
    })

    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
    } = form;


    const onSubmitHandler: SubmitHandler<ResetUserInput> = async (values) => {
        try {
            setSubmitting(true);
            setError(null);
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const message = (await res.json()).message;
                return;
            }
            signIn(undefined, { callbackUrl: "/" });

        } catch (error: any) {
            setError(error.message);
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

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
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Email</FormLabel>
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
                                    placeholder="e.g. jane@doe.com"
                                    {...register("email")}
                                />
                                </div>
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <div style={{ textAlign: "center", paddingBottom: 15, paddingTop: 5 }}>
                    <Button
                        type="submit"
                        style={{ width: 200, borderRadius: 10 }}
                        disabled={submitting}
                    >
                        Send reset email
                    </Button>
                </div>
            </form>

            <hr style={{ borderColor: 'gray'}} />
        </Form>
    );
}
