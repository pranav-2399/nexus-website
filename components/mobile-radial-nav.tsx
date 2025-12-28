import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Hexagon, Home, Calendar, Users, Image, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
  name: string
  href: string
}

// Function to get the appropriate icon for each navigation item
const getNavIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'home':
      return <Home size={16} />
    case 'events':
      return <Calendar size={16} />
    case 'team':
      return <Users size={16} />
    case 'gallery':
      return <Image size={16} />
    case 'contact':
      return <Mail size={16} />
    default:
      return <Hexagon size={16} />
  }
}

interface MobileRadialNavProps {
  navItems: NavItem[]
}

export function MobileRadialNav({ navItems }: MobileRadialNavProps) {
  const [open, setOpen] = useState(false)
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleMouseDown = (e: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleScroll = () => { setOpen(false) }

    document.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [open])


  // Hide on desktop
  // (Tailwind's md:hidden will be used in the parent div)

  // Radial positions
  const radius = 200 // px

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Hexagon Button */}
      <div className="fixed top-6 right-6 z-[65] flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen((v) => !v)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-800 shadow-2xl border-4 border-purple-400/40 hover:shadow-purple-500/40 transition-all duration-300"
          style={{ boxShadow: open ? "0 0 40px 10px #a21caf88" : undefined }}
        >
          <span className="text-3xl font-extrabold text-white drop-shadow-lg select-none" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.05em' }}>N</span>
          <span className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />
        </motion.button>

        {/* Radial Portal Menu - Quarter Circle around the corner button */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={portalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-6 right-6 z-[65] pointer-events-auto"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Nav Items positioned in a quarter circle around the main button */}
                {navItems.map((item, i) => {
                  // Create a quarter circle (90 degrees) starting from Left (Top of the quadrant)
                  // Distribute items evenly across the quarter circle
                  const quarterAngleStep = (Math.PI / 2) / (navItems.length - 1) // 90 degrees divided by number of items
                  const angle = Math.PI - (i * quarterAngleStep) // Start from Left (PI) and go Down (PI/2)
                  const x = Math.cos(angle) * radius // Reduced radius to bring buttons closer to main N button
                  const y = Math.sin(angle) * radius
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                      animate={{ x, y, opacity: 1, scale: 1 }}
                      exit={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 * i }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center group"
                      >
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 shadow-lg border-2 border-white/10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                          <span className="text-white drop-shadow select-none">
                            {getNavIcon(item.name)}
                          </span>
                        </span>
                        <span className="mt-1 text-xs font-semibold text-white drop-shadow group-hover:text-pink-300 transition-colors duration-200">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 