import { redirect } from "next/navigation";

export default function Home() {
  redirect("/my-drive");

  return null;
}
