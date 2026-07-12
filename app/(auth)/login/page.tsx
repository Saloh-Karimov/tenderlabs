import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

import { login } from "./actions";

const errorMessages: Record<string, string> = {
  invalid_input: "Enter a valid email address and password.",
  auth_failed: "Invalid email or password.",
  confirm_failed:
    "Email confirmation failed or the link expired. Sign in, or sign up again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (errorMessages[error] ?? null) : null;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Access your tender conversion workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={login} className="flex flex-col gap-4">
          {errorMessage && (
            <Alert variant="destructive">
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
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/signup"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
