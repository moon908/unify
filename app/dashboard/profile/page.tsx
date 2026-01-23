import React, { Suspense } from 'react'
import Profile from '@/components/profile/Profile'

const page = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 font-bold">Connecting to Employee Database...</p>
            </div>
        }>
            <Profile />
        </Suspense>
    )
}

export default page