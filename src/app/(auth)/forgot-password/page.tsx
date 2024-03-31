import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default async function ForgotPasswordView() {
  return (
    <div className="flex justify-center items-center h-screen" style={{ 
      background: `
        linear-gradient(to bottom, #e0f2f1, #b2dfdb),
        repeating-linear-gradient(
          45deg,
          rgba(178, 223, 219, 0.1),
          rgba(178, 223, 219, 0.1) 10px,
          transparent 10px,
          transparent 20px
        )
      `
    }}>

      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-7 text-center">Password Reset Form</h2>
        <ForgotPasswordForm />
        <div
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div style={{ display: "flex" }}>
            <p style={{ color: "gray" }}>{"Have an account?"}</p>
          </div>
          <div>
            <Button variant="link">
              <Link href="/signin">Login now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
