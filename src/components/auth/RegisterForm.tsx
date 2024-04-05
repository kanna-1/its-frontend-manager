"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { School } from "@prisma/client";
import { Landmark, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  institution: z.string().min(1, { message: "Select a valid institution" }),
});

export function RegisterForm({ schools }: { schools: School[] }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      institution: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);

      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const message = (await res.json()).message;
        if (message.includes("Invalid `prisma.user.create()` invocation")) {
          throw new Error("This email address is already registered.");
        } else {
          throw new Error("An error occurred during registration.");
        }
      }

      toast({
        title: "Signup Success",
        description: "Redirecting to sign-in",
        variant: "success",
      });
      setTimeout(() => {
        signIn(undefined, { callbackUrl: "/" });
      }, 3000);
    } catch (error) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      form.reset();
      setSubmitting(false);
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
                  <Input disabled={submitting} {...field} />
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
                  <Input type="password" disabled={submitting} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution/ School</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <div className="flex space-x-2 items-center">
                    <Landmark />
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select Institution"
                        {...field}
                      />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full justify-center items-center text-center">
          <LoadingButton
            type="submit"
            className="w-3/4 mt-4"
            loading={submitting}
            disabled={submitting}
          >
            Register
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
