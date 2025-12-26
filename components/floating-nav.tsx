"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MobileRadialNav } from "@/components/mobile-radial-nav"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Team", path: "/team" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
]

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50)
      scaleX.set(latest / (document.documentElement.scrollHeight - window.innerHeight))
    })
    return () => unsubscribe()
  }, [scrollY, scaleX])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 origin-left z-[60]"
        style={{ scaleX }}
      />
      {/* Desktop Floating Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-[55] px-6 py-3 rounded-full transition-all duration-300",
          isScrolled
            ? "bg-white/10 backdrop-blur-lg shadow-lg border border-white/20"
            : "bg-black/40 backdrop-blur-md border border-white/5"
        )}
      >
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative group"
            >
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  pathname === item.path
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.name}
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={false}
                animate={{
                  width: pathname === item.path ? "100%" : "0%",
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={false}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>
      </motion.nav>
      {/* Mobile Radial Nav */}
      <div className="md:hidden">
        <MobileRadialNav navItems={navItems.map(({ name, path }) => ({ name, href: path }))} />
      </div>
    </>
  )
} 