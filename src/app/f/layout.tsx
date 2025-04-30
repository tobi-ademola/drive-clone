import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "~/components/ui/input";

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-svh w-screen overflow-hidden bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      <header className="grid grid-cols-12 px-6 py-2.5">
        <div className="col-span-3 flex items-center gap-3">
          <Image
            src={"/icon.png"}
            alt="Google Drive Logo"
            width={40}
            height={40}
          />
          <h2 className="cursor-pointer text-2xl font-medium hover:underline">
            Drive
          </h2>
        </div>

        <div className="col-span-6">
          <Input
            placeholder="Search in Drive"
            type="search"
            className="h-14 rounded-[32rem] bg-neutral-300 px-12 py-4 font-semibold ring-offset-0 md:text-2xl dark:bg-neutral-700"
          />
        </div>

        <div className="col-span-3 flex items-center justify-end gap-4">
          <Link
            href={"/f/settings"}
            aria-label="Settings"
            className="rounded-full p-2 hover:bg-neutral-300"
          >
            <SettingsIcon className="aspect-square w-6 text-neutral-500 dark:text-neutral-200" />
          </Link>
          <div className="flex items-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <div className="grid h-svh w-screen grid-cols-12 overflow-hidden">
        <aside className="col-span-3 h-screen">
          <div className="flex h-full w-64 flex-col p-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="rounded p-2 hover:bg-gray-700">
                My Drive
              </a>
              <a href="#" className="rounded p-2 hover:bg-gray-700">
                Shared with me
              </a>
              <a href="#" className="rounded p-2 hover:bg-gray-700">
                Recent
              </a>
              <a href="#" className="rounded p-2 hover:bg-gray-700">
                Starred
              </a>
              <a href="#" className="rounded p-2 hover:bg-gray-700">
                Trash
              </a>
            </nav>
          </div>
        </aside>
        <main className="col-span-9 h-full">
          <section>{children}</section>
        </main>
      </div>
    </div>
  );
}
