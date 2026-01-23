"use client"

import React from 'react'
import { Lightbulb, Target, Users, Layout, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

const ProTip = () => {
    const router = useRouter()
    const sections = [
        {
            icon: <Target className="size-6 text-emerald-500" />,
            title: "Strategic Isolation",
            description: "Workspaces allow you to separate different business units or client projects. This prevents data sprawl and ensures each team has a focused environment containing only the tools and documents relevant to their specific goals."
        },
        {
            icon: <Users className="size-6 text-blue-500" />,
            title: "Access Control",
            description: "Assign specific team members to specific workspaces. This ensures that sensitive information remains restricted to authorized personnel while still allowing company-wide collaboration through shared workspaces."
        },
        {
            icon: <Layout className="size-6 text-purple-500" />,
            title: "Unified Resource Management",
            description: "Each workspace acts as a container for tasks, milestones, and documentation. Instead of searching through a global list, your team can find everything they need in one dedicated hub."
        }
    ]

    return (
        <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/20 via-primary/5 to-transparent p-10 border border-primary/10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Lightbulb className="size-32" />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <Lightbulb className="size-4" /> Professional Guide
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-black">
                        The Power of <span className="text-primary">Workspaces</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed italic">
                        "Your projects deserve more than just a folder. They deserve an ecosystem."
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
                {sections.map((section, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-none bg-white/5 backdrop-blur-sm">
                        <CardHeader className="space-y-4">
                            <div className="p-3 rounded-2xl bg-white/10 w-fit group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>
                            <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {section.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary Footer */}
            <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold">Ready to organize?</h3>
                    <p className="text-muted-foreground">Start by creating a workspace for your next big milestone.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:gap-4 transition-all shadow-lg" onClick={() => { router.push('/workspace') }}>
                    Go back to setup <ArrowRight className="size-5" />
                </button>
            </div>
        </div>
    )
}

export default ProTip