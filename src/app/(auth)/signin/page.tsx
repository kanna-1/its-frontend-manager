import React from "react";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInView(): Promise<React.JSX.Element> {
  return (
    <div
      className="flex flex-col space-y-8 justify-center items-center min-h-screen"
      style={{
        background: `
        linear-gradient(to bottom, #e0f2f1, #b2dfdb),
        repeating-linear-gradient(
          45deg,
          rgba(178, 223, 219, 0.1),
          rgba(178, 223, 219, 0.1) 10px,
          transparent 10px,
          transparent 20px
        )
      `,
      }}
    >
      <h1 className="text-2xl font-semibold">ITS Frontend Manager</h1>
      <Card className="min-w-96 md:min-w-[500px]">
        <CardHeader>
          <CardTitle className="text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <CardFooter className="justify-center">
            <span className="text-sm">Don&rsquo;t have an account?</span>
            <Link href="/signup">
              <Button variant="link" className="text-sm">
                Register Now
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
