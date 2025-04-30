import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-b from-neutral-900 to-neutral-800 p-4 text-center text-white">
      <div>
        <h1 className="mb-4 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          Sign in - Tobi Drive
        </h1>
        <p className="mx-auto mb-8 max-w-md text-xl text-neutral-400 md:text-2xl">
          Secure, fast, and easy file storage for the modern web
        </p>

        <Button
          size="lg"
          className="cursor-pointer border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
          asChild
        >
          <SignInButton forceRedirectUrl={"/drive"} />
        </Button>
      </div>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Tobi Drive. All rights reserved.
      </footer>
    </div>
  );
}
