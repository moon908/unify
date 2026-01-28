'use server'

import { supabase } from '@/lib/supabase/client'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createOrganization(formData: FormData) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const role = (formData.get('role') as string) || 'Owner'

    // 1. Create Organization
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([
            { name, type, role, created_by: userId }
        ])
        .select()
        .single()

    if (orgError) {
        console.error('Error creating organization:', orgError)
        return { success: false, error: orgError.message }
    }

    // 2. Add creator as member with the selected role
    const { error: memberError } = await supabase
        .from('organization_members')
        .insert([
            { org_id: org.id, user_id: userId, role }
        ])

    if (memberError) {
        console.error('Error adding member:', memberError)
        return { success: false, error: memberError.message }
    }

    revalidatePath('/organisation')
    return { success: true }
}

export async function deleteOrganization(orgId: string) {
    try {
        const { userId } = await auth()
        if (!userId) {
            console.error('Delete attempt by unauthenticated user')
            return { success: false, error: 'Unauthorized' }
        }

        console.log(`Starting deletion for org: ${orgId} by user: ${userId}`)

        // 1. Delete associated members first
        const { error: memberError } = await supabase
            .from('organization_members')
            .delete()
            .eq('org_id', orgId)

        if (memberError) {
            console.error('Error deleting members:', memberError)
            return { success: false, error: `Failed to delete members: ${memberError.message}` }
        }

        // 2. Delete the organization
        const { error: orgError } = await supabase
            .from('organizations')
            .delete()
            .eq('id', orgId)
            .eq('created_by', userId) // Security: only creator can delete

        if (orgError) {
            console.error('Error deleting organization:', orgError)
            return { success: false, error: `Failed to delete organization: ${orgError.message}` }
        }

        console.log(`Successfully deleted org: ${orgId}`)
        revalidatePath('/organisation')
        return { success: true }
    } catch (err) {
        console.error('Unexpected error in deleteOrganization:', err)
        return { success: false, error: 'An unexpected error occurred' }
    }
}