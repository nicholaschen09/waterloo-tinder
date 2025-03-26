"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center px-4">
        <div className="relative h-4 w-full">
          {/* UW color bar - inspired by Waterloo branding */}
          <div className="absolute left-0 top-0 h-1 w-full bg-black"></div>
          <div className="absolute left-0 bottom-0 h-3 w-full flex">
            <div className="h-full w-1/4 bg-[hsl(42,99%,65%)]"></div>
            <div className="h-full w-1/4 bg-[hsl(42,92%,60%)]"></div>
            <div className="h-full w-1/4 bg-[hsl(40,85%,55%)]"></div>
            <div className="h-full w-1/4 bg-[hsl(39,100%,46%)]"></div>
          </div>
        </div>
      </div>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">WaterlooMatch</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/matches"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/matches" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Matches
          </Link>
          <Link
            href="/messages"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/messages" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Messages
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/profile" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            My Profile
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
