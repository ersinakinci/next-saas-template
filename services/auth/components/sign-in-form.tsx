import { Anvil, ShieldAlert } from "lucide-react";

import { cn } from "@/services/ui/api.client";
import { Button } from "@/services/ui/components/button";
import { Input } from "@/services/ui/components/input";
import { Label } from "@/services/ui/components/label";
import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { providerMap, signIn } from "@/services/auth/api.server";
import { serverEnv } from "@/services/env/api.server";

export function SignInForm({
  className,
  callbackUrl,
  error,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  variant: "sign-in" | "sign-up";
  callbackUrl?: string;
  error?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        {error && (
          <div className="flex items-center gap-4 bg-destructive p-4 rounded-md text-destructive-foreground">
            <ShieldAlert className="size-12" />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">
                There was an error signing in.
              </p>
              <p className="text-sm">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <Anvil className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
          </Link>
          {variant === "sign-in" && (
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
          )}
          {variant === "sign-up" && (
            <h1 className="text-xl font-bold">Sign up for Acme Inc.</h1>
          )}
          <div className="text-center text-sm">
            {variant === "sign-in" && (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </>
            )}
            {variant === "sign-up" && (
              <>
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
        <form
          className="flex flex-col gap-6"
          action={async (formData) => {
            "use server";

            const data = {
              ...Object.fromEntries(formData.entries()),
              redirectTo: callbackUrl ?? "",
            };

            try {
              if (serverEnv.NODE_ENV === "development") {
                await signIn("credentials", data);
              } else {
                await signIn("resend", data);
              }
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`/sign-in?error=${error.type}`);
              }
              throw error;
            }
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button> */}

          {Object.values(providerMap)
            .filter((p) => p.id !== "credentials" && p.id !== "resend")
            .map((provider) => (
              <form
                key={provider.id}
                className="col-span-full"
                action={async () => {
                  "use server";
                  try {
                    await signIn(provider.id, {
                      redirectTo: callbackUrl ?? "",
                    });
                  } catch (error) {
                    // Signin can fail for a number of reasons, such as the user
                    // not existing, or the user not having the correct role.
                    // In some cases, you may want to redirect to a custom error
                    if (error instanceof AuthError) {
                      return redirect(`/sign-in?error=${error.type}`);
                    }

                    // Otherwise if a redirects happens Next.js can handle it
                    // so you can just re-thrown the error and let Next.js handle it.
                    // Docs:
                    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                    throw error;
                  }
                }}
              >
                <Button variant="outline" className="w-full">
                  {provider.id === "google" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  Continue with {provider.name}
                </Button>
              </form>
            ))}
        </div>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
