import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signup } from "./actions";

const errorMessages: Record<string, string> = {
  invalid_input:
    "Enter a valid email address and a password of at least 6 characters.",
  signup_failed: "Sign up failed. Try again in a moment.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;
  const errorMessage = error ? (errorMessages[error] ?? null) : null;

  if (sent) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent you a confirmation link. Open it to activate your account,
            then sign in.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already confirmed?{" "}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Set up access to the tender conversion workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signup} className="flex flex-col gap-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Could not sign up</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
