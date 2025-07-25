import { signOut } from "@/services/auth.server";
import { redirect } from "next/navigation";

export async function GET() {
  await signOut();

  return redirect("/");
}
