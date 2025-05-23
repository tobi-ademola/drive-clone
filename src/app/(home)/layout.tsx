export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-screen place-items-center bg-gradient-to-b from-neutral-900 to-neutral-800 p-4 text-center text-white">
      <main>{props.children}</main>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Tobi Drive. All rights reserved.
      </footer>
    </div>
  );
}
