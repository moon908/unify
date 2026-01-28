'use client'

import { Trash2 } from 'lucide-react'
import { deleteOrganization } from '@/lib/actions/org-actions'
import { toast } from 'sonner'
import { useState } from 'react'

interface DeleteOrgButtonProps {
    orgId: string
}

export function DeleteOrgButton({ orgId }: DeleteOrgButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Are you sure you want to delete this organization?')) return

        setIsDeleting(true)
        try {
            const result = await deleteOrganization(orgId)
            if (result.success) {
                toast.success('Organization deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete organization')
            }
        } catch (error) {
            toast.error('An error occurred while deleting')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-3 right-3 z-50 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete Organization"
        >
            <Trash2 size={18} className={isDeleting ? 'animate-pulse' : ''} />
        </button>
    )
}
