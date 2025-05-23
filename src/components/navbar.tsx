"use client"

import Link from "next/link"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Menu, X, Bell, User, Settings, LogOut, LayoutDashboard, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/redux/api/loginApiSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import OTMSLoader from "@/components/OTMSLoader"

export function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.login)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await dispatch(logout())
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2-second delay
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isLoggedIn = userInfo && userInfo.email ? true : false;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-7xl mx-auto justify-between px-4 sm:px-8 md:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold">OTMS</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          <Link
            href="/features"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
          {isLoggedIn && (
            <Link
              href="/traineedashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border">
                      <User size={16} className="text-foreground/80" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                      <User className="h-5 w-5 text-foreground/80" />
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{userInfo?.firstName} {userInfo?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/traineedashboard" className="cursor-pointer w-full flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer w-full flex items-center text-red-600" disabled={isLoggingOut}>
                    {isLoggingOut ? <OTMSLoader /> : <LogOut className="mr-2 h-4 w-4" />}
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
          
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          
          <div className="sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-2 px-4 bg-background border-b">
          <nav className="flex flex-col space-y-3 py-3">
            <Link
              href="/features"
              className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isLoggedIn && (
              <Link
                href="/traineedashboard"
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Toggle theme</span>
              <ThemeToggle />
            </div>
            
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <div className="flex items-center space-x-2 rounded-md px-3 py-2 bg-slate-100 dark:bg-slate-800">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userInfo?.firstName} {userInfo?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild className="justify-start" onClick={handleLogout}>
                  <Link href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    {isLoggingOut ? <OTMSLoader /> : <LogOut className="mr-2 h-4 w-4" />}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2 px-3 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
} 