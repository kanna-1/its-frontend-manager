import React from "react";
import Link from "next/link";
import { getSchools } from "@/actions/getSchools";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignUpView(): Promise<React.JSX.Element> {
  const schools = await getSchools().then((schools) =>
    schools ? schools : []
  );
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
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm schools={schools} />
          <CardFooter className="justify-center mt-4">
            <span className="text-sm">Have an account?</span>
            <Link href="/signin">
              <Button variant="link" className="text-sm">
                Login Now
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
