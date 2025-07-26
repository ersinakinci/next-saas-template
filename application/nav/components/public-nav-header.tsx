"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Anvil, ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { cn } from "@/services/ui/api.client";
import { Button, buttonVariants } from "@/services/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/services/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/services/ui/components/sheet";

const navigationItems = [
  {
    title: "Features",
    href: "/features",
    description: "Take a closer look at what our product can do for you.",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Choose the perfect plan for your needs.",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about our company and mission.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Read our latest articles and stay up to date.",
  },
];

export function PublicNavHeader() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-8 md:px-0 md:mx-auto">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            <Anvil className="h-6 w-6" />
            <span className="font-bold">Acme Inc.</span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <MobileLink
                href="/"
                className="flex items-center m-6"
                onOpenChange={setIsOpen}
              >
                <div className="flex items-center">
                  <Anvil className="mr-2 h-4 w-4" />
                  <SheetTitle>Acme Inc.</SheetTitle>
                </div>
              </MobileLink>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navigationItems.map((item) => (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setIsOpen}
                    >
                      {item.title}
                    </MobileLink>
                  ))}
                  <div className="flex flex-col gap-3 pt-8">
                    {session ? (
                      <MobileLink
                        href="/app"
                        onOpenChange={setIsOpen}
                        className="flex items-center gap-1"
                      >
                        Back to app <ArrowRight className="w-4 h-4" />
                      </MobileLink>
                    ) : (
                      <>
                        <MobileLink href="/sign-in" onOpenChange={setIsOpen}>
                          Sign in
                        </MobileLink>
                        <MobileLink href="/sign-up" onOpenChange={setIsOpen}>
                          <Button className="bg-indigo-600 hover:bg-indigo-500">
                            Sign up
                          </Button>
                        </MobileLink>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex md:flex-1">
          <NavigationMenu className="ml-4">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-4">
          {session ? (
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/app"
              onClick={() => setIsOpen(false)}
            >
              Back to app <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-2 w-fit">
              <Link href="/sign-in">
                <Button variant="link" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={className}
    >
      {children}
    </Link>
  );
}
