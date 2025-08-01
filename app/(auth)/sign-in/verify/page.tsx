import { VerifyRequest } from "@/services/auth/components/verify-request";

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyRequest />
      </div>
    </div>
  );
}
