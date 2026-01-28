'use server'

import { supabase } from '@/lib/supabase/client'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createWorkspace(formData: FormData, orgId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const project = formData.get('project') as string
    const color = formData.get('color') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string || 'active'

    // 1. Create Workspace
    const { data: workspace, error: workspaceError } = await supabase
        .from('Workspace')
        .insert([
            {
                project,
                color,
                description,
                status,
                org_id: orgId,
                created_by: userId
            }
        ])
        .select()
        .single()

    if (workspaceError) {
        console.error('Error creating workspace:', workspaceError)
        return { success: false, error: workspaceError.message }
    }

    // 2. Add creator as member (if there's a WorkspaceMember table)
    // For now, let's just assume we only need the Workspace record.
    // If the user wants to add team members by email, we might need to handle that.
    // But since we don't have a users table with emails yet (using Clerk), 
    // we might just store the emails or invite them.
    // For simplicity, let's just create the workspace first.

    revalidatePath(`/organisation/${orgId}/dashboard/workspace`)
    return { success: true, data: workspace }
}

export async function getWorkspaces(orgId: string) {
    const { data, error } = await supabase
        .from('Workspace')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching workspaces:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}

export async function deleteWorkspace(workspaceId: string, orgId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('Workspace')
        .delete()
        .eq('id', workspaceId)
        .eq('created_by', userId) // Security: only creator can delete

    if (error) {
        console.error('Error deleting workspace:', error)
        return { success: false, error: error.message }
    }

    revalidatePath(`/organisation/${orgId}/dashboard/workspace`)
    return { success: true }
}
