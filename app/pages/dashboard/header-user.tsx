import { useState } from "react"
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
} from "lucide-react"
import { useNavigate } from "react-router"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { clearSession, getSession, toCapitalized } from "~/services"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function HeaderUser() {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const sessionUser = getSession()?.user
  const user = {
    name: sessionUser?.name ?? "User",
    role: toCapitalized(sessionUser?.role) || "Member",
    avatar: "https://github.com/shadcn.png",
  }

  function handleLogout() {
    clearSession()
    setLogoutOpen(false)
    navigate("/", { replace: true })
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Notifications"
        className="relative size-10 rounded-full"
      >
        <BellIcon className="size-5" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full pl-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Avatar className="size-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight sm:grid">
              <span className="truncate text-sm font-semibold">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role}
              </span>
            </div>
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-64 rounded-xl p-1.5"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-2.5 rounded-lg px-3 py-2.5 text-sm [&_svg:not([class*='size-'])]:size-5">
              <BadgeCheckIcon />
              Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2.5 rounded-lg px-3 py-2.5 text-sm [&_svg:not([class*='size-'])]:size-5"
            onSelect={(event) => {
              event.preventDefault()
              setLogoutOpen(true)
            }}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of PrepRoute?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be signed out of your account and need to log in again to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
