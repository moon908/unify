import React from 'react'
import Dashboard from '@/components/dashboard/Dashboard'

const page = async ({ params }: { params: { orgId: string } }) => {
  const { orgId } = await params
  return (
    <Dashboard orgId={orgId} />
  )
}

export default page