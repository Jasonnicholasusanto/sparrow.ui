"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  LayoutDashboard,
  Star,
  Settings,
  Bell,
  LogOut,
  UserRound,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/authActions";
import { ThemeToggle } from "@/components/ui/theme-button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/providers/user-provider";
import { parseFullName } from "@/lib/utils/parseName";
import { usePathname } from "next/navigation";
import { useHeader } from "@/providers/header-provider";
import { ExpandableSearch } from "./components/expandable-search";
import { CreateWatchlistDialog } from "@/components/create-watchlist/create-watchlist-dialog";

export default function Header() {
  const { user } = useUser();
  const { navbarRoutes } = useHeader();
  const pathname = usePathname();
  const { firstName, lastName } = parseFullName(user?.profile?.full_name);

  async function handleLogout() {
    await logout();
    window.location.href = "/auth/sign-in";
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-440 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/platform"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight"
          >
            <Image
              src="/images/sparrow-logo-black.png"
              alt="Sparrow Logo"
              width={25}
              height={25}
              priority
              className="block dark:hidden"
            />
            <Image
              src="/images/sparrow-logo-white.png"
              alt="Sparrow Logo"
              width={25}
              height={25}
              priority
              className="hidden dark:block"
            />
            Sparrow
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navbarRoutes.map(({ label, href }) => {
              const isActive =
                pathname === href ||
                (href === "/dashboard" && pathname === "/platform");
              return (
                <Link
                  key={href}
                  href={`/platform${href}`}
                  className={`flex items-center gap-2 text-sm transition ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-row items-center gap-4">
          <ExpandableSearch />

          <ThemeToggle />

          <CreateWatchlistDialog isIconOnly={true} />

          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>

          <Separator orientation="vertical" className="h-6 self-center!" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Profile"
                    className="
                        rounded-full
                        hover:bg-accent dark:hover:bg-accent/50
                        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                      "
                  >
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={user?.profile?.profile_picture ?? ""}
                        alt={user?.profile?.full_name ?? ""}
                      />
                      <AvatarFallback>
                        {firstName?.charAt(0)}
                        {lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Account settings and more</TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              className="flex flex-col w-auto min-w-65 rounded-lg py-3 px-4 gap-1.5"
              side="bottom"
              align="end"
              sideOffset={15}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage
                      src={user?.profile?.profile_picture ?? ""}
                      alt={user?.profile?.full_name ?? ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {firstName?.charAt(0)}
                      {lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">
                      {firstName} {lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      @{user?.profile?.username}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col gap-1.5">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/platform/trader/${user?.profile.username}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <UserRound className="h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  cursor-pointer rounded-md
                  bg-destructive/10 text-destructive
                  hover:bg-destructive/20
                  focus:bg-destructive/20
                "
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
