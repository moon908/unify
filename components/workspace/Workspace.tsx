'use client'

import React, { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronUp, Users, Layout, Palette, Info, Activity, Loader2, Trash2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useParams } from 'next/navigation'
import { createWorkspace, getWorkspaces, deleteWorkspace } from '@/lib/actions/workspace-actions'
import { sendWorkspaceInvite } from '@/lib/actions/email-actions'
import { toast } from 'sonner'

const Workspace = () => {
    const params = useParams()
    const orgId = params.orgId as string

    const [isExpanded, setIsExpanded] = useState(false)
    const [workspaces, setWorkspaces] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Invitation states
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null)
    const [inviteEmails, setInviteEmails] = useState('')
    const [isInviting, setIsInviting] = useState(false)

    useEffect(() => {
        if (orgId) {
            fetchWorkspaces()
        }
    }, [orgId])

    const fetchWorkspaces = async () => {
        setIsLoading(true)
        const result = await getWorkspaces(orgId)
        if (result.success) {
            setWorkspaces(result.data || [])
        } else {
            toast.error('Failed to load workspaces')
        }
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const result = await createWorkspace(formData, orgId)

        if (result.success) {
            toast.success('Workspace created successfully')
            setIsExpanded(false)
            fetchWorkspaces()
                ; (e.target as HTMLFormElement).reset()
        } else {
            toast.error(result.error || 'Failed to create workspace')
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (workspaceId: string) => {
        if (!confirm('Are you sure you want to delete this workspace?')) return

        const result = await deleteWorkspace(workspaceId, orgId)
        if (result.success) {
            toast.success('Workspace deleted')
            fetchWorkspaces()
        } else {
            toast.error(result.error || 'Failed to delete workspace')
        }
    }

    const handleInviteMembers = async () => {
        if (!inviteEmails.trim()) {
            toast.error('Please enter at least one email address.')
            return
        }

        setIsInviting(true)
        const result = await sendWorkspaceInvite(inviteEmails, selectedWorkspace.project, orgId)

        if (result.success) {
            toast.success('Invitations sent successfully!')
            setIsInviteOpen(false)
            setInviteEmails('')
        } else {
            toast.error(result.error || 'Failed to send invitations.')
        }
        setIsInviting(false)
    }

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'border-l-blue-500',
            green: 'border-l-green-500',
            purple: 'border-l-purple-500',
            red: 'border-l-red-500',
            orange: 'border-l-orange-500',
        }
        return colors[color] || 'border-l-primary'
    }

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            {/* Create Workspace Section */}
            <div className="bg-background border rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Plus size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-semibold text-black">Create New Workspace</h2>
                            <p className="text-sm text-muted-foreground">Set up a new space for your team projects</p>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                </button>

                {isExpanded && (
                    <div className="p-6 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="project" className="flex items-center gap-2 text-black">
                                        <Layout size={14} /> Workspace Name
                                    </Label>
                                    <Input id="project" name="project" placeholder="E.g. Engineering Team" required className="text-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="flex items-center gap-2 text-black">
                                        <Palette size={14} /> Color
                                    </Label>
                                    <Select name="color" defaultValue="blue">
                                        <SelectTrigger id="color" className="text-black">
                                            <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blue">Blue</SelectItem>
                                            <SelectItem value="green">Green</SelectItem>
                                            <SelectItem value="purple">Purple</SelectItem>
                                            <SelectItem value="red">Red</SelectItem>
                                            <SelectItem value="orange">Orange</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2 text-black">
                                    <Info size={14} /> Description
                                </Label>
                                <Textarea id="description" name="description" placeholder="Briefly describe the purpose of this workspace..." className="min-h-[100px] text-black" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="flex items-center gap-2 text-black">
                                        <Activity size={14} /> Status
                                    </Label>
                                    <Select name="status" defaultValue="Active">
                                        <SelectTrigger id="status" className="text-black">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" className='text-black cursor-pointer hover:bg-gray-200' variant="outline" onClick={() => setIsExpanded(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" className='cursor-pointer' disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Workspace
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* All Workspaces Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-800">All Workspaces</h2>
                        <p className="text-sm text-muted-foreground">Manage and view all your active workspaces</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader className="h-32 bg-muted/50" />
                            </Card>
                        ))}
                    </div>
                ) : workspaces.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Layout className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No workspaces found</h3>
                        <p className="text-muted-foreground">Get started by creating your first workspace above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((workspace) => (
                            <Card key={workspace.id} className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${getColorClass(workspace.color)}`}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg truncate mr-2">{workspace.project}</CardTitle>
                                        <Badge variant={workspace.status === 'Active' ? 'default' : 'secondary'}>
                                            {workspace.status}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">{workspace.description || 'No description provided.'}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                            <Users size={16} />
                                            <span>Team Members</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-2/3 text-black cursor-pointer hover:bg-gray-100 border-dashed"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedWorkspace(workspace)
                                                setIsInviteOpen(true)
                                            }}
                                        >
                                            <Plus size={14} className="mr-2" />
                                            Add members
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(workspace.id)
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Invite Members Dialog */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Invite to {selectedWorkspace?.project}
                        </DialogTitle>
                        <DialogDescription>
                            Enter email addresses separated by commas to invite team members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="emails" className="text-black">Email Addresses</Label>
                            <Textarea
                                id="emails"
                                placeholder="e.g. alex@example.com, sam@example.com"
                                value={inviteEmails}
                                onChange={(e) => setInviteEmails(e.target.value)}
                                className="min-h-[120px] text-black"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isInviting}>
                            Cancel
                        </Button>
                        <Button onClick={handleInviteMembers} disabled={isInviting}>
                            {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Invitations
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Workspace

