import { UserButton } from '@clerk/nextjs'
export const dynamic = 'force-dynamic'
import { currentUser } from '@clerk/nextjs/server'
import { Building2, Plus, Globe, Shield, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GrAd } from 'react-icons/gr'
import { supabase } from '@/lib/supabase/client'
import { CreateOrgDialog } from '@/components/organisation/CreateOrgDialog'
import Link from 'next/link'
import { DeleteOrgButton } from '@/components/organisation/DeleteOrgButton'


const Page = async () => {
  const user = await currentUser()

  if (!user) return null

  // Fetch organizations from Supabase
  const { data: orgData, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('created_by', user.id)

  if (error) {
    console.error('Error fetching organizations:', error)
  }




  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-primary/10'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 transition-all'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
          <Link href="/" className='flex items-center space-x-2 group cursor-pointer'>
            <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
              <GrAd className='text-primary' size={24} />
            </div>
            <h1 className='text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>Unify</h1>
          </Link>

          <div className='flex items-center gap-4'>
            <div className='hidden md:block text-right'>
              <p className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                Welcome back, {user?.firstName}!
              </p>
              <p className='text-xs text-muted-foreground'>
                {user?.emailAddresses[0].emailAddress}
              </p>
            </div>
            <UserButton afterSignOutUrl='/sign-in' />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className='max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-12'>
          <h2 className='text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-slate-50'>
            Your Organizations
          </h2>
          <p className='text-lg text-muted-foreground flex items-center gap-2'>
            <Globe size={18} className='text-primary' />
            Manage your Organizations and collaborate with your team in one place.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Create New Dialog */}
          <CreateOrgDialog />

          {/* Org Cards */}

          {orgData?.map((org) => (
            <Link key={org.id} href={`/organisation/${org.id}/dashboard`}>
              <Card className='group relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-slate-200 dark:border-slate-800 min-h-[160px]'>
                <DeleteOrgButton orgId={org.id} />
                <CardHeader className='p-6'>
                  <div className='flex justify-between items-start'>
                    <div className='p-2 bg-primary/5 rounded-lg'>
                      <Building2 className='w-6 h-6 text-primary' />
                    </div>
                    <div className='px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 border'>
                      {org.type}
                    </div>
                  </div>
                  <CardTitle className='text-xl mt-2'>{org.name}</CardTitle>
                  <CardDescription className='flex items-center gap-1'>
                    <Shield size={14} className='text-orange-500' />
                    {org.role}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>

    </div>
  )
}

export default Page
