"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Crown, User, Linkedin, Mail, Users, Code, Palette, MessageSquare, Briefcase } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  year: string
  photo: string
  bio?: string
  socialMedia?: { platform: string; url: string }[]
}

interface Department {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  leads: TeamMember[]
  members: TeamMember[]
  subdepartments?: Department[]
}

const departmentIcons: Record<string, React.ReactNode> = {
  "Board Members": <Crown className="h-6 w-6" />,
  "Frontend": <Code className="h-6 w-6" />,
  "Backend": <Code className="h-6 w-6" />,
  "AI/ML": <Code className="h-6 w-6" />,
  "Tech Leads": <Crown className="h-6 w-6" />,
  "Design Team": <Palette className="h-6 w-6" />,
  "Social Media Team": <MessageSquare className="h-6 w-6" />,
  "Management": <Users className="h-6 w-6" />,
  "Organizing Committee": <Briefcase className="h-6 w-6" />,
  "Marketing": <MessageSquare className="h-6 w-6" />,
  "Sponsorship/Outreach": <Briefcase className="h-6 w-6" />,
}

const departmentColors: Record<string, string> = {
  "Board Members": "yellow",
  "Frontend": "green",
  "Backend": "purple",
  "AI/ML": "pink",
  "Tech Leads": "yellow",
  "Design Team": "orange",
  "Social Media Team": "cyan",
  "Management": "indigo",
  "Organizing Committee": "red",
  "Marketing": "green",
  "Sponsorship/Outreach": "purple",
}

export function CoreTeamTreeRedesigned() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data.teams || [])
      })
  }, [])

  useEffect(() => {
    const boardRoleOrder: Record<string, number> = {
      "chairperson": 1,
      "vice-chairperson": 2,
      "general secretary": 3,
      "joint secretary": 4,
      "technical lead": 5,
      "events lead": 6,
    }

    const sortedMembers = [...teamMembers].sort((a, b) => {
      // Only sort Board Members
      if (
        a.department === "Board Members" &&
        b.department === "Board Members"
      ) {
        const aOrder = boardRoleOrder[a.role.toLowerCase()] ?? 999
        const bOrder = boardRoleOrder[b.role.toLowerCase()] ?? 999
        return aOrder - bOrder
      }

      return 0 // Keep all other departments in their original order
    })

    const hasChanged = sortedMembers.some(
      (member, index) => member.id !== teamMembers[index]?.id
    )

    if (hasChanged) {
      setTeamMembers(sortedMembers)
    }
  }, [teamMembers])

  useEffect(() => {
    // Group members by department
    const deptMap: Record<string, Department> = {}

    const boardRoleOrder: Record <string, number> = {
      "chairperson": 1,
      "vice-chairperson": 2,
      "vice chairperson": 2,
      "vice-chariperson": 2, // handles typo if present in DB
      "general secretary": 3,
      "joint secretary": 4,
      "technical lead": 5,
      "events lead": 6,
    }

    const sortedBoardMembers = teamMembers
      .filter((member) => member.department === "Board Members")
      .sort((a, b) => {
        const aOrder = boardRoleOrder[a.role.toLowerCase()] ?? 999
        const bOrder = boardRoleOrder[b.role.toLowerCase()] ?? 999
        return aOrder - bOrder
      })

    teamMembers.forEach(member => {
      const deptName = member.department || "Other"
      if (!deptMap[deptName]) {
        deptMap[deptName] = {
          id: deptName.toLowerCase().replace(/\s+/g, "-"),
          name: deptName,
          icon: departmentIcons[deptName] || <Briefcase className="h-6 w-6" />,
          color: departmentColors[deptName] || "primary",
          leads: [],
          members: [],
        }
      }
      // If member is a lead, set as lead, else add to members
      if (/lead|president|head|secretary/i.test(member.role)) {
        deptMap[deptName].leads.push(member)
      } else {
        deptMap[deptName].members.push(member)
      }
    })

    setDepartments(Object.values(deptMap))
  }, [teamMembers])

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "border-blue-500/30 hover:border-blue-500/50 text-blue-400",
      green: "border-green-500/30 hover:border-green-500/50 text-green-400",
      purple: "border-purple-500/30 hover:border-purple-500/50 text-purple-400",
      pink: "border-pink-500/30 hover:border-pink-500/50 text-pink-400",
      yellow: "border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400",
      orange: "border-orange-500/30 hover:border-orange-500/50 text-orange-400",
      cyan: "border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400",
      red: "border-red-500/30 hover:border-red-500/50 text-red-400",
      indigo: "border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400",
    }
    return colorMap[color] || "border-primary/30 hover:border-primary/50 text-primary"
  }

  const MemberCard = ({ member, onClick }: { member: TeamMember; onClick: () => void }) => (
    <Card className="backdrop-panel border-primary/20 glow-hover cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          {member.photo ? (
            <Image
              src={member.photo || "/placeholder.svg"}
              alt={member.name}
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
        <h4 className="font-semibold text-white text-sm mb-1">{member.name}</h4>
        <p className="text-xs text-primary">{member.role}</p>
      </CardContent>
    </Card>
  )

  const DepartmentCard = ({ department }: { department: Department }) => (
    <Card className={`backdrop-panel ${getColorClasses(department.color)} glow-hover cursor-pointer transition-all duration-300`}
      onClick={() => setSelectedDepartment(department)} >
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">{department.icon}</div>
        <h3 className="font-bold text-white text-lg mb-2">{department.name}</h3>
        <p className="text-xs text-gray-400">
          {department.members.length + department.leads.length} members
        </p>
      </CardContent>
    </Card>
  )

  return (
    <section id="team" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4">Core Team Structure</h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the dedicated individuals leading Nexus Club towards innovation and excellence
          </p>
        </div>

        <div className="backdrop-panel rounded-2xl p-4 md:p-8 glow-effect">
          {/* Board Members - Main Center Node */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold gradient-text">Board Members</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {teamMembers
                .filter((member) => member.department === "Board Members")
                .map((member) => (
                  <MemberCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
                ))}
            </div>
          </div>

        </div>

        {/* Member Info Modal */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="modal-content max-w-md mx-4 rounded-2xl md:rounded-2xl">
            <DialogHeader>
              <DialogTitle className="gradient-text">Team Member</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                    {selectedMember.photo ? (
                      <Image
                        src={selectedMember.photo || "/placeholder.svg"}
                        alt={selectedMember.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{selectedMember.name}</h3>
                  <Badge variant="outline" className="border-primary text-primary mt-2 text-xs md:text-sm">
                    {selectedMember.role}
                  </Badge>
                </div>

                {selectedMember.bio && <p className="text-gray-300 text-sm leading-relaxed">{selectedMember.bio}</p>}

                <div className="flex gap-2 md:gap-3 justify-center">
                  {selectedMember?.socialMedia?.find(sm => sm.platform === "Email") && (
                    <Button size="sm" variant="outline" asChild className="text-xs md:text-sm">
                      <a href={selectedMember.socialMedia.find(sm => sm.platform === "Email")?.url}>
                        <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                  {selectedMember?.socialMedia?.find(sm => sm.platform === "LinkedIn") && (
                    <Button size="sm" variant="outline" asChild className="text-xs md:text-sm">
                      <a href={selectedMember.socialMedia.find(sm => sm.platform === "LinkedIn")?.url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </section>
  )
}