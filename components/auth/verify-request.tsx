import { Mail } from "lucide-react";
import Link from "next/link";
import { Anvil } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export const VerifyRequest = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
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
          <h1 className="text-xl font-bold">Check your email</h1>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-sm font-semibold">
            A sign in link has been sent to your email address.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to sign in to your account.
          </p>
        </div>

        <Link href="/sign-in">
          <Button variant="outline" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </div>
    </div>
  );
};
