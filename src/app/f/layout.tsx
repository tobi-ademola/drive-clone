"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import {
  ClockIcon,
  CloudIcon,
  FileUpIcon,
  FolderPlusIcon,
  FolderUpIcon,
  HardDriveIcon,
  HomeIcon,
  LaptopIcon,
  MenuIcon,
  OctagonAlertIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontal,
  StarIcon,
  Trash2Icon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  useEffect,
  type MouseEvent,
} from "react";
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

import { useParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useRouter } from "next/navigation";
import { uploadFiles } from "~/components/uploadthing";
import { createFolder, generateFolderUploadPaths } from "~/server/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  DialogTitle,
} from "~/components/ui/dialog";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: <HomeIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "My Drive",
    icon: <HardDriveIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Computers",
    icon: <LaptopIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Shared with me",
    icon: <UsersIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Recent",
    icon: <ClockIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Starred",
    icon: <StarIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Spam",
    icon: <OctagonAlertIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Bin",
    icon: <Trash2Icon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
  {
    label: "Storage",
    icon: <CloudIcon className="mr-2 inline-block h-5 w-5" />,
    href: "/",
  },
];

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout states
  const [menuOpen, setMenuOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("Untitled folder");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  // const [container, setContainer] = useState<HTMLElement | null>(null);

  // Upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dirFiles, setDirFiles] = useState<File[]>([]);

  // Auth values

  const user = useAuth();

  // Selectors
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadFolderInputRef = useRef<HTMLInputElement | null>(null);

  // Path functions
  const params = useParams<{ folderId: string }>();
  const navigate = useRouter();

  // Asychronous helpers
  const startUpload = useCallback(
    async (files: File[], input: { folderId: number }) => {
      await uploadFiles("driveUploader", {
        files,
        input,
        onUploadProgress: (status) => setUploadProgress(status.progress),
        onUploadBegin: () => console.info("toast: upload began!"),
      })
        .catch((e) => {
          throw e;
        })
        .then(() => {
          navigate.refresh();
          setUploadProgress(0);
        });
    },
    [navigate],
  );

  // Upload Initiators
  const initiateFileUpload = useCallback(() => {
    console.log("Initiate file upload triggered");
    if (uploadFileInputRef.current) {
      uploadFileInputRef.current.click();
    } else {
      console.error("File input ref is not set");
    }
  }, [uploadFileInputRef]);

  const initiateFolderUpload = useCallback(() => {
    console.log("Initiate folder upload triggered");
    if (uploadFolderInputRef.current) {
      uploadFolderInputRef.current.click();
    } else {
      console.error("Folder input ref is not set");
    }
  }, [uploadFolderInputRef]);

  // Upload handlers
  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log("File upload event triggered");
    const filesList = e.target.files;

    if (!filesList || filesList.length === 0) {
      console.log("No files selected");
      return;
    }

    const filesArr: File[] = Array.from(filesList);
    console.log("Files selected:", filesArr);
    setFiles(filesArr);

    e.target.value = "";
  }, []);

  const handleFolderUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log("Folder upload event triggered");

    const filesList = e.target.files;

    if (!filesList || filesList.length === 0) {
      console.log("No folders selected");
      return;
    }

    const filesArr = Array.from(filesList);
    setDirFiles(filesArr);
    console.log(filesArr);

    e.target.value = "";
  }, []);

  // Upload effectors
  useEffect(() => {
    console.log(files);
    if (files.length > 0) {
      const res = startUpload(files, { folderId: Number(params.folderId) });
      console.log(res);
      setFiles([]);
    }
  }, [files, startUpload, params.folderId]);

  // Debounce uploads: prevent new uploads if one is in progress, and lock params.folderId during upload
  const [isUploading, setIsUploading] = useState(false);
  const lockedParamsRef = useRef<{ folderId: string | undefined }>({
    folderId: params.folderId,
  });

  const handleFolderCreation = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setNewFolderDialogOpen(false);

      if (!lockedParamsRef.current.folderId)
        throw new Error(`Parent folder must be defined!`);

      if (!newFolderName) throw new Error(`Folder name must be defined`);

      const result = await createFolder(
        newFolderName,
        Number(lockedParamsRef.current.folderId),
      );

      console.log(result);
      navigate.refresh();
    },
    [newFolderName, navigate],
  );

  useEffect(() => {
    if (dirFiles.length > 0 && !isUploading) {
      if (!user.userId) {
        console.log("Not authenticated");
        setDirFiles([]);
        return;
      }

      setIsUploading(true);
      lockedParamsRef.current.folderId = params.folderId;

      const uploadAll = async () => {
        for (const file of dirFiles) {
          const relPathNames = file.webkitRelativePath.split("/");
          console.log(relPathNames);

          try {
            if (!lockedParamsRef.current.folderId) {
              console.error("Folder ID is undefined");
              setIsUploading(false);
              setDirFiles([]);
              return;
            }

            console.log("folder ID is defined");

            const relPathsId = await generateFolderUploadPaths(
              relPathNames,
              lockedParamsRef.current.folderId,
              user.userId,
            );

            console.log(relPathsId);

            if (relPathsId && relPathsId?.length !== 0) {
              console.log(relPathsId);
              await startUpload([file], {
                folderId: Number(relPathsId[relPathsId.length - 1]),
              });
            }
          } catch (e) {
            console.error(e);
            break;
          }
        }

        console.log("Finished uploading all files");
        setIsUploading(false);
        setDirFiles([]);
      };

      void uploadAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirFiles, startUpload, user.userId]);

  useEffect(() => {
    console.log(uploadProgress);
  }, [uploadProgress]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      {/* Toolbar Component */}
      <header className="grid grid-cols-12 grid-rows-2 gap-y-3 px-3 py-2.5 md:grid-rows-1 md:gap-y-0 md:px-6">
        <div
          style={{
            gridRow: "1 / span 1",
            gridColumn: "1 / 7",
          }}
          className="flex items-center gap-3 md:col-span-2 md:col-start-1 md:row-start-1"
        >
          <Button
            variant={"ghost"}
            size={"icon"}
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="aspect-square w-6" />
          </Button>
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

      {/* Hidden file input that handles all the upload requests */}
      <input
        className="hidden"
        type="file"
        ref={uploadFileInputRef}
        multiple
        onChange={handleFileUpload}
      />
      <input
        className="hidden"
        type="file"
        ref={uploadFolderInputRef}
        multiple
        // @ts-expect-error: webkitdirectory is not in TS types, but works in browsers
        webkitdirectory="true"
        onChange={handleFolderUpload}
      />

      {/* Desktop Content Area */}
      <div className="h-full w-full max-md:hidden md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="px-3 py-3 md:px-4 lg:px-6"
        >
          <ResizablePanel
            defaultSize={(2 / 12) * 100}
            minSize={(2 / 12) * 100}
            maxSize={(3.5 / 12) * 100}
          >
            <aside>
              <div className="flex w-full items-center">
                <Dialog
                  open={newFolderDialogOpen}
                  onOpenChange={setNewFolderDialogOpen}
                  modal
                >
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
                          <DialogTrigger asChild>
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
                          </DialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Button
                            variant={"ghost"}
                            className="w-full cursor-pointer px-1 py-0.5"
                            onClick={initiateFileUpload}
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
                            onClick={initiateFolderUpload}
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
                  <DialogPortal data-slot="dialog-portal">
                    <DialogOverlay />

                    <DialogContent className="text-neutral-700 dark:text-neutral-200">
                      <DialogHeader className="text-left">
                        <DialogTitle>New Folder</DialogTitle>
                      </DialogHeader>
                      <div>
                        <Input
                          id="newFolder"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          onClick={(e) => handleFolderCreation(e)}
                        >
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </div>
              <div className="text-sm lg:text-base">
                <nav className="flex h-full w-full flex-col gap-8 pt-4 pr-4 text-sm lg:text-base">
                  {Array.from(
                    { length: Math.ceil(navItems.length / 3) },
                    (_, i) => (
                      <section
                        key={i}
                        className="flex h-full w-full flex-col gap-3"
                      >
                        <ul>
                          {navItems
                            .slice(i * 3, i * 3 + 3)
                            .map((item, index) => (
                              <li key={index}>
                                <Link
                                  href={item.href}
                                  className="flex cursor-pointer rounded-3xl px-4 py-1 hover:bg-neutral-300 dark:hover:bg-neutral-500"
                                >
                                  <span>{item.icon}</span>
                                  <span>{item.label}</span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </section>
                    ),
                  )}
                </nav>
              </div>
            </aside>
          </ResizablePanel>
          <ResizableHandle className="invisible" />
          <ResizablePanel
            defaultSize={(10 / 12) * 100}
            className="rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <main className="min-h-full overflow-auto px-6">{children}</main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Content Area */}
      <aside
        className={`absolute top-0 -left-full z-50 h-full w-[90vw] max-w-sm -translate-x-full overflow-hidden rounded-lg bg-neutral-300 p-4 text-neutral-700 transition-all duration-1000 max-md:block md:hidden dark:bg-neutral-700 dark:text-neutral-200 ${menuOpen ? "left-0" : "-left-full"}`}
      >
        <div className="flex w-full items-center justify-end">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setMenuOpen(false)}
          >
            <XIcon className="aspect-square w-10 scale-120" />
          </Button>
        </div>
        {/* <div className="flex w-full items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-16 w-30 h-full cursor-pointer rounded-xl bg-neutral-300 py-4 font-semibold text-neutral-900 hover:bg-neutral-400 dark:bg-neutral-700 dark:text-neutral-200">
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
                    <DropdownMenuShortcut>Alt+C then F</DropdownMenuShortcut>
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
                    <DropdownMenuShortcut>Alt+C then U</DropdownMenuShortcut>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full cursor-pointer px-1 py-0.5"
                  >
                    <FolderUpIcon className="mr-2 aspect-square w-4 scale-115" />
                    Folder upload
                    <DropdownMenuShortcut>Alt+C then I</DropdownMenuShortcut>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        <div>
          <nav className="flex h-full w-full flex-col gap-8 pt-4 pr-4 text-sm lg:text-base">
            {Array.from({ length: Math.ceil(navItems.length / 3) }, (_, i) => (
              <section key={i} className="flex h-full w-full flex-col gap-3">
                <ul>
                  {navItems.slice(i * 3, i * 3 + 3).map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="flex cursor-pointer rounded-3xl px-4 py-1 hover:bg-neutral-300 dark:hover:bg-neutral-500"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
      </aside>
      <div className="h-full w-full px-3 max-md:block md:hidden">
        <main className="h-[95%] w-full overflow-auto rounded-lg bg-neutral-100 px-3 pb-96 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
          {children}

          <div className="absolute right-6 bottom-3 z-20 grid aspect-[1/3] w-18 gap-2">
            <Button
              variant={"default"}
              className="h-full cursor-pointer rounded-xl bg-blue-400 text-black hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              aria-label="New folder icon"
              onClick={() => setNewFolderDialogOpen(true)}
            >
              <FolderPlusIcon />
            </Button>
            <Button
              variant={"default"}
              className="h-full cursor-pointer rounded-xl bg-blue-400 text-black hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              aria-label="Upload file icon"
              onClick={initiateFileUpload}
            >
              <FileUpIcon />
            </Button>
            <Button
              variant={"default"}
              className="h-full cursor-pointer rounded-xl bg-blue-400 text-black hover:bg-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              aria-label="Upload folder icon"
              onClick={initiateFolderUpload}
            >
              <FolderUpIcon />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
