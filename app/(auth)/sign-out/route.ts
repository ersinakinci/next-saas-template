import { signOut } from "@/services/auth/api.server";
import { redirect } from "next/navigation";

export async function GET() {
  await signOut();

  return redirect("/");
}
