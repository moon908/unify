"use client"

import { useState } from 'react'
import { Plus, Briefcase, Users, Lock, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import WorkspaceCard from '@/components/workspace/workspaceCard'

const Workspace = () => {
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
                    Workspaces
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage your team environments and project hubs.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-black">
                {/* Create Workspace Form */}
                <Card id="create-workspace" className={`lg:col-span-2 group relative overflow-hidden border-none shadow-2xl bg-linear-to-br from-card/80 to-card/30 backdrop-blur-xl transition-all duration-500 ease-in-out ${!isExpanded ? 'hover:scale-[1.01] cursor-pointer' : ''}`}>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] -ml-24 -mb-24 rounded-full" />

                    {!isExpanded ? (
                        <div
                            className="relative z-10 p-8 flex items-center justify-between"
                            onClick={() => setIsExpanded(true)}
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    <Plus className="size-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">Create New Workspace</h2>
                                    <p className="text-muted-foreground mt-1">Ready to start a new project hub?</p>
                                </div>
                            </div>
                            <Button className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                                Get Started
                            </Button>
                        </div>
                    ) : (
                        <>
                            <CardHeader className="relative z-10 flex flex-row items-start justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Plus className="size-5" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Create New Workspace</CardTitle>
                                    <CardDescription>
                                        Set up a new environment for your team to collaborate on projects.
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(false);
                                    }}
                                >
                                    <X className="size-5 text-muted-foreground" />
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-6 relative z-10 p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="ws-name">Workspace Name</Label>
                                        <Input id="ws-name" placeholder="e.g. Design Team, Q1 Logistics" className="bg-white/5 border-white/10 h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ws-type">Privacy Setting</Label>
                                        <Select>
                                            <SelectTrigger id="ws-type" className="bg-white/5 border-white/10 h-11">
                                                <SelectValue placeholder="Select Visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="size-4" />
                                                        <span>Public (Team)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    <div className="flex items-center gap-2">
                                                        <Lock className="size-4" />
                                                        <span>Private (Only me)</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ws-desc">Description (Optional)</Label>
                                    <Input id="ws-desc" placeholder="Briefly describe the purpose of this workspace..." className="bg-white/5 border-white/10 h-11" />
                                </div>
                            </CardContent>

                            <CardFooter className="relative z-10 border-t border-white/5 p-6 md:p-8">
                                <Button className="w-full md:w-auto px-10 h-12 text-md font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                    Launch Workspace
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>

                {/* Sidebar Highlight/Info Card */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur-md border border-white/5 p-4">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="size-5 text-primary" />
                                Pro Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed -mt-5">
                                Workspaces help you group related projects and team members together. You can always change members and settings later.
                            </p>
                            <Button variant="link" className="px-0 mt-1 text-primary group font-semibold" onClick={() => { router.push('/workspace/proTip') }}>
                                Learn about workspaces <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-black">Active Workspaces</h2>
                </div>
                <WorkspaceCard onAddClick={() => {
                    setIsExpanded(true);
                    document.getElementById('create-workspace')?.scrollIntoView({ behavior: 'smooth' });
                }} />
            </div>
        </div>
    )
}

export default Workspace