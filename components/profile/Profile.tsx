"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Award,
    Edit,
    Github,
    Twitter,
    Linkedin,
    Globe,
    Star,
    ExternalLink,
    ShieldCheck,
    Link as LinkIcon
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface UserProfile {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    department: string;
    joinDate: string;
    bio: string;
    skills: string[];
    experience: string;
    image?: string;
    socials: {
        github?: string;
        linkedin?: string;
        xcom?: string;
    }
}

const Profile = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('User')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) throw error;

                if (data) {
                    setUser({
                        id: data.id,
                        name: data.name || "Unknown User",
                        role: data.role || "Team Member",
                        email: data.email || "N/A",
                        phone: data.phone || "Not provided",
                        location: data.location || "Remote",
                        department: data.department || "General",
                        joinDate: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
                        bio: data.bio || "No bio provided yet.",
                        skills: Array.isArray(data.skills) ? data.skills : [],
                        experience: data.experience || "0 years",
                        image: data.image,
                        socials: {
                            github: data.github,
                            linkedin: data.linkedin,
                            xcom: data.xcom
                        }
                    });
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error.message);
                toast.error("Failed to load user profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 font-bold animate-pulse">Loading amazing profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50 text-center p-4">
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-zinc-200">
                    <ShieldCheck className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">User Not Found</h2>
                    <p className="text-zinc-500 max-w-xs mx-auto">We couldn't find the profile you're looking for. It might have been moved or deleted.</p>
                </div>
            </div>
        );
    }

    const stats = [
        { label: "Experience", value: user.experience, icon: <Award className="w-4 h-4 text-blue-500" /> },
        { label: "Skills", value: user.skills.length, icon: <Star className="w-4 h-4 text-yellow-500" /> },
        { label: "Department", value: user.department, icon: <Globe className="w-4 h-4 text-indigo-500" /> }
    ];

    return (
        <div className="min-h-screen bg-zinc-50/50 text-zinc-900 p-4 md:p-8 selection:bg-indigo-500/30">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header Section */}
                <div className="relative rounded-[2rem] overflow-hidden bg-white border border-zinc-200 shadow-xl">
                    {/* Header Background */}
                    <div className="h-48 md:h-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500" />
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
                        <div className="absolute inset-0 bg-grid-black/[0.05]" />
                    </div>

                    <div className="px-6 pb-8 md:px-10 md:pb-10">
                        <div className="relative -mt-20 md:-mt-24 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                            >
                                <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-white rounded-3xl shadow-xl">
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback className="text-4xl bg-zinc-100 text-zinc-900 font-bold">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            <div className="flex-1 space-y-3 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight">{user.name}</h1>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-zinc-600">
                                    <span className="flex items-center gap-2 text-lg font-medium text-indigo-600">
                                        <Briefcase className="w-5 h-5" />
                                        {user.role}
                                    </span>
                                    <span className="hidden md:block w-1 h-1 rounded-full bg-zinc-300" />
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-zinc-400" />
                                        {user.location}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:flex-none border-zinc-200 hover:bg-zinc-50 text-zinc-700 cursor-pointer">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Button>
                                <Button className="flex-1 md:flex-none bg-zinc-900 text-white hover:bg-zinc-800 font-semibold px-8 shadow-lg shadow-zinc-200 cursor-pointer">
                                    Connect
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="bg-white border border-zinc-200 p-6 rounded-2xl flex items-center gap-5 hover:border-indigo-300 hover:shadow-lg transition-all group"
                        >
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Story/Bio */}
                        <Card className="bg-white border-zinc-200 rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-zinc-900">About Me</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-600 leading-relaxed text-lg">
                                    {user.bio}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Expertise */}
                        <Card className="bg-white border-zinc-200 rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    Core Expertise
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.length > 0 ? (
                                        user.skills.map((skill, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="bg-zinc-100 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-600 border-transparent hover:border-indigo-100 px-4 py-1.5 rounded-lg transition-all cursor-default"
                                            >
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-zinc-400 italic text-sm">No skills added yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Organization Info */}
                        <Card className="bg-white border-zinc-200 rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-zinc-900">Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { icon: Globe, label: "Department", value: user.department },
                                    { icon: Calendar, label: "Member Since", value: user.joinDate },
                                    { icon: Mail, label: "Work Email", value: user.email },
                                    { icon: Phone, label: "Direct Phone", value: user.phone },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-zinc-50 text-indigo-500 mt-1">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-sm font-semibold text-zinc-700 mt-0.5 break-all">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Social Connect */}
                        <Card className="bg-white border-zinc-200 rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-zinc-900">Social Presence</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-3 text-zinc-400">
                                <Button
                                    variant="outline"
                                    className="h-12 border-zinc-200 hover:bg-zinc-50 hover:text-indigo-600 transition-all cursor-pointer"
                                    onClick={() => user.socials.github && window.open(`https://${user.socials.github.replace('https://', '')}`, '_blank')}
                                    disabled={!user.socials.github}
                                >
                                    <Github className={cn("w-5 h-5", !user.socials.github && "opacity-20")} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 border-zinc-200 hover:bg-zinc-50 hover:text-indigo-600 transition-all cursor-pointer"
                                    onClick={() => user.socials.linkedin && window.open(`https://${user.socials.linkedin.replace('https://', '')}`, '_blank')}
                                    disabled={!user.socials.linkedin}
                                >
                                    <Linkedin className={cn("w-5 h-5", !user.socials.linkedin && "opacity-20")} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 border-zinc-200 hover:bg-zinc-50 hover:text-indigo-600 transition-all cursor-pointer"
                                    onClick={() => user.socials.xcom && window.open(`https://${user.socials.xcom.replace('https://', '')}`, '_blank')}
                                    disabled={!user.socials.xcom}
                                >
                                    <Twitter className={cn("w-5 h-5", !user.socials.xcom && "opacity-20")} />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Profile

