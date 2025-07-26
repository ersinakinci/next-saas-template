import { SignInForm } from "@/services/auth/components/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string; verifyRequest?: string };
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm callbackUrl="/app" error={error} variant="sign-in" />
      </div>
    </div>
  );
}
