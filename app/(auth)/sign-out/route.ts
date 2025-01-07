import { signOut } from "@/services/auth";
import { redirect } from "next/navigation";

export async function GET() {
  await signOut();

  return redirect("/");
}
