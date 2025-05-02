import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  FileUpIcon,
  FolderPlusIcon,
  FolderUpIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "~/components/common/mode-toggle";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      {/* Toolbar Component */}
      <header className="grid grid-cols-12 grid-rows-2 gap-y-3 px-3 py-2.5 md:grid-rows-1 md:gap-y-0 md:px-6">
        <div
          style={{
            gridRow: "1 / span 1",
            gridColumn: "1 / 7",
          }}
          className="flex items-center gap-3 md:col-span-2 md:col-start-1 md:row-start-1"
        >
          <Image
            src={"/icon.png"}
            alt="Google Drive Logo"
            width={40}
            height={40}
          />
          <h2 className="cursor-pointer text-[1.3rem] font-medium hover:underline">
            Drive
          </h2>
        </div>

        <div className="relative col-span-12 grid items-center md:col-span-7 md:col-start-3 md:row-start-1">
          <Button
            size={"icon"}
            variant={"ghost"}
            type={"submit"}
            aria-label="Search"
            className="absolute ml-3 cursor-pointer justify-self-start rounded-full p-2 hover:bg-neutral-400 dark:hover:bg-neutral-500"
          >
            <SearchIcon className="aspect-square w-6 text-neutral-500 hover:text-neutral-400 dark:text-neutral-200" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            aria-label="Filter"
            className="absolute mr-3 cursor-pointer justify-self-end rounded-full p-2 hover:bg-neutral-400 dark:hover:bg-neutral-500"
          >
            <SlidersHorizontal className="aspect-square w-6 text-neutral-500 hover:text-neutral-400 dark:text-neutral-200" />
          </Button>

          <Input
            placeholder="Search in Drive"
            type="search"
            aria-label="Search in Drive"
            className="h-12 w-full rounded-[32rem] bg-neutral-300 px-14 py-4 font-semibold ring-offset-0 md:text-2xl dark:bg-neutral-700"
          />
        </div>

        <div
          style={{ gridRow: "1 / span 1", gridColumn: "7 / 13" }}
          className="flex items-center justify-end gap-4 md:col-span-3 md:col-start-10 md:row-start-1"
        >
          <Link
            href={"/f/settings"}
            aria-label="Settings"
            className="rounded-full p-2 hover:bg-neutral-300 dark:hover:bg-neutral-500"
          >
            <SettingsIcon className="aspect-square w-6 text-neutral-500 dark:text-neutral-200" />
          </Link>
          <div className="flex scale-50 items-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Toolbar Component End */}

      <ResizablePanelGroup direction="horizontal" className="px-3 py-6 md:px-6">
        <ResizablePanel
          defaultSize={(2 / 12) * 100}
          minSize={(2 / 12) * 100}
          maxSize={(3.5 / 12) * 100}
        >
          <aside>
            <div className="flex w-full items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-16 w-30 cursor-pointer rounded-xl bg-neutral-300 py-4 font-semibold text-neutral-900 hover:bg-neutral-400 dark:bg-neutral-700 dark:text-neutral-200">
                    <PlusIcon className="mr-2 aspect-square w-4 scale-115" />
                    New
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Button
                        variant={"ghost"}
                        className="w-full cursor-pointer px-1 py-0.5"
                      >
                        <FolderPlusIcon className="mr-2 aspect-square w-4 scale-115" />
                        New folder
                        <DropdownMenuShortcut>
                          Alt+C then F
                        </DropdownMenuShortcut>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Button
                        variant={"ghost"}
                        className="w-full cursor-pointer px-1 py-0.5"
                      >
                        <FileUpIcon className="mr-2 aspect-square w-4 scale-115" />
                        File upload
                        <DropdownMenuShortcut>
                          Alt+C then U
                        </DropdownMenuShortcut>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button
                        variant={"ghost"}
                        className="w-full cursor-pointer px-1 py-0.5"
                      >
                        <FolderUpIcon className="mr-2 aspect-square w-4 scale-115" />
                        Folder upload
                        <DropdownMenuShortcut>
                          Alt+C then I
                        </DropdownMenuShortcut>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link href={"/"}></Link>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </ResizablePanel>
        <ResizableHandle className="invisible" />
        <ResizablePanel className="rounded-lg">
          <main>{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* <div className="grid h-full w-screen grid-cols-12 overflow-hidden">
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
      </div> */}
    </div>
  );
}
