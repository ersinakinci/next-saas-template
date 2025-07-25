import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = (await searchParams).error;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm callbackUrl="/app" error={error} variant="sign-up" />
      </div>
    </div>
  );
}
