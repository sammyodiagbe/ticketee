"use client";

import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="w-full max-w-[400px] space-y-6 p-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <svg
              className="h-12 w-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Check your email 📧</h2>
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your email and click
            the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/sign-in"
            className="inline-block w-full bg-blue-500 text-white rounded-md px-4 py-2 text-center hover:bg-blue-600"
          >
            Back to Sign In
          </Link>
          <div className="text-sm text-center">
            <span className="text-muted-foreground">
              Didn't receive the email?{" "}
            </span>
            <button className="text-primary hover:text-primary/90 font-medium">
              Click to resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
