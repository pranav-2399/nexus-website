"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Hexagon } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/#events" },
    { name: "Team", href: "/#team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "backdrop-panel shadow-lg" : "bg-black/40 backdrop-blur-md border-b border-white/5"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all duration-300"></div>
            </div>
            <span className="text-xl font-bold gradient-text">Nexus Club</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href.startsWith('/#') && pathname === '/' && window.location.hash === item.href.substring(1))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-300 hover:text-primary transition-colors duration-200 relative group ${isActive ? "text-primary" : ""
                    }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="backdrop-panel border-primary/20 w-[280px] sm:w-[350px]"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href.startsWith('/#') && pathname === '/' && window.location.hash === item.href.substring(1))

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg transition-colors duration-200 py-2 ${isActive
                            ? "text-primary"
                            : "text-gray-300 hover:text-primary"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
