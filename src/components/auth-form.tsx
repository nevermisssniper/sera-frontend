"use client";

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {type === "logIn" ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {type === "logIn"
            ? "Enter your email below to login to your account"
            : "Enter your email below to create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                maxLength={100}
              />
            </div>
            <AuthFormBtn type={type} />
          </div>
          <div className="mt-4 text-center text-sm">
            {type === "logIn" ? (
              <>
                Already have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </>
            )}
          </div>
          {signUpError && (
            <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>
          )}
          {logInError && (
            <p className="text-red-500 text-sm mt-2">{logInError.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
