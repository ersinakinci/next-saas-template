import { LoginForm } from "@/components/auth/login-form";
import { VerifyRequest } from "@/components/auth/verify-request";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string; verifyRequest?: string };
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl="/app" error={error} variant="sign-in" />
      </div>
    </div>
  );
}
