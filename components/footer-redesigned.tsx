"use client"

import Link from "next/link"
import { Hexagon, Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function FooterRedesigned() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/#events" },
    { name: "Team", href: "/#team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Highlights", href: "/#highlights" },
    { name: "Contact", href: "/contact" },
  ]

  const socialLinks = [
    { icon: <Mail className="h-4 w-4 md:h-5 md:w-5" />, href: "mailto:nexusvitc@gmail.com", label: "Email" },
    { icon: <Github className="h-4 w-4 md:h-5 md:w-5" />, href: "https://github.com/Nexus-VITC", label: "GitHub" },
    { icon: <Linkedin className="h-4 w-4 md:h-5 md:w-5" />, href: "https://www.linkedin.com/company/nexusvitchennai/", label: "LinkedIn" },
    { icon: <Instagram className="h-4 w-4 md:h-5 md:w-5" />, href: "https://www.instagram.com/nexus_vitc", label: "Twitter" },
  ]

  return (
    <footer className="relative">
      <div className="backdrop-panel border-t border-primary/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Logo & Description */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <Hexagon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <span className="text-lg md:text-xl font-bold gradient-text">Nexus Club</span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Empowering the next generation of tech innovators through collaboration, learning, and cutting-edge
                projects.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-base md:text-lg font-semibold text-white">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200 text-xs md:text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-base md:text-lg font-semibold text-white">Contact</h4>
              <div className="space-y-2 text-xs md:text-sm text-gray-400">
                <Link
                  href={socialLinks[0].href}
                  className="text-gray-40 hover:text-primary transition-colors duration-200"
                  aria-label={socialLinks[0].label}
                >
                  nexusvitc@gmail.com
                </Link>

                <p>VIT Chennai</p>
                <h4 className="text-base md:text-lg font-semibold text-white">Faculty Coordinators</h4>
                <p>Dr. S. Pavithra</p>
                <p>Dr. Lekshmi K</p>


              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary/20 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs md:text-sm">© {new Date().getFullYear()} Nexus Club | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
