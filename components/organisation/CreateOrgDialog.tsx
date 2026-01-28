'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createOrganization } from '@/lib/actions/org-actions'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'

export function CreateOrgDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('Business')
    const [role, setRole] = useState('Admin')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        // Ensure Select values are present (Radix Select sometimes doesn't play well with native FormData)
        if (!formData.has('type')) formData.set('type', type)
        if (!formData.has('role')) formData.set('role', role)

        const result = await createOrganization(formData)

        if (result.success) {
            console.log("Creation successful, closing dialog...")
            setOpen(false)
            // Reset state
            setType('Business')
            setRole('Admin')
            if (e.currentTarget) e.currentTarget.reset()
            toast.success('Organization created successfully')
        } else {
            console.error("Creation failed:", result.error)
            toast.error(result.error || 'Failed to create organization')
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Card className='border-dashed bg-transparent hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center p-6 space-y-3 min-h-[160px]'>
                    <div className='p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 group-hover:scale-110 transition-all'>
                        <Plus className='w-8 h-8 text-primary' />
                    </div>
                    <div className='text-center'>
                        <h3 className='font-semibold text-lg'>Create New Organization</h3>
                        <p className='text-sm text-muted-foreground px-4'>Start a new workspace for your team.</p>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-slate-50">Create Organization</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Create a new organization to start collaborating with your team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Organization Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Acme Inc."
                                required
                                className="text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50/50 dark:bg-slate-950/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-slate-700 dark:text-slate-300">Type</Label>
                            <Select name="type" value={type} onValueChange={setType}>
                                <SelectTrigger className="text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/50">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Business">Business</SelectItem>
                                    <SelectItem value="Personal">Personal</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Non-profit">Non-profit</SelectItem>
                                </SelectContent>
                            </Select>
                            <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">Your Role</Label>
                            <Select name="role" value={role} onValueChange={setRole}>
                                <SelectTrigger className="text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950/50">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Organization'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
