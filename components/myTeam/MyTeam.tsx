"use client";

import { useState } from 'react';
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    User as UserIcon,
    Mail,
    Briefcase,
    ShieldCheck,
    Filter,
    ArrowUpRight,
} from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { TeamMember } from '@/constants/constants';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MyTeam = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeamFromSupabase = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('User')
                    .select('id, image, name, role, department');

                if (error) throw error;

                console.log('Supabase Data:', data); // Debug log

                if (data && data.length > 0) {
                    const supabaseMembers = data.map((u) => ({
                        id: u.id,
                        name: u.name || 'Unknown User',
                        role: u.role || 'Team Member',
                        email: `${(u.name || 'user').toLowerCase().replace(/\s+/g, '.')}@example.com`,
                        department: u.department || 'General',
                        initials: (u.name || '??').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
                        image: u.image || undefined
                    }));

                    setMembers(supabaseMembers);
                } else {
                    console.warn('User table is empty.');
                    setMembers([]);
                }
            } catch (error: any) {
                console.error('Error fetching from Supabase:', error.message);
                toast.error("Failed to load team data.");
                setMembers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamFromSupabase();
    }, []);

    const departments = Array.from(new Set(members.map(m => m.department)));

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !selectedDepartment || member.department === selectedDepartment;
        return matchesSearch && matchesDept;
    });

    const stats = [
        { label: 'Total Members', value: members.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Online Now', value: 0, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Departments', value: departments.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="p-8 min-h-screen bg-slate-50/50 dark:bg-[#020617]">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 -rotate-3">
                            <Users className="w-8 h-8" />
                        </div>
                        My Team
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Manage your team members and their roles across the organization.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-11 px-5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2"
                        onClick={() => toast.success("Invite feature coming soon!")}
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group"
                    >
                        <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Search by name, role or email..."
                        className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
                    <Button
                        variant={selectedDepartment === null ? "default" : "outline"}
                        onClick={() => setSelectedDepartment(null)}
                        className={cn(
                            "rounded-xl h-10 px-4 font-bold whitespace-nowrap transition-all",
                            selectedDepartment === null ? "bg-slate-900 dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        )}
                    >
                        All
                    </Button>
                    {departments.map(dept => (
                        <Button
                            key={dept}
                            variant={selectedDepartment === dept ? "default" : "outline"}
                            onClick={() => setSelectedDepartment(selectedDepartment === dept ? null : dept)}
                            className={cn(
                                "rounded-xl h-10 px-4 font-bold whitespace-nowrap transition-all",
                                selectedDepartment === dept ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                            )}
                        >
                            {dept}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Team Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-500 font-bold">Fetching your team...</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                variants={itemVariants}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Decorative background element */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-slate-900 shadow-xl border-2 border-slate-100 dark:border-slate-800">
                                            <AvatarImage src={member.image} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-black">
                                                {member.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5 justify-center">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {member.role}
                                    </p>

                                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-bold mb-6">
                                        {member.department}
                                    </Badge>

                                    <div className="w-full flex items-center justify-center gap-2 mt-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 rounded-xl h-10 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                            onClick={() => router.push(`/profile?userId=${member.id}`)}
                                        >
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            View Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 rounded-xl h-10 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                            onClick={() => {
                                                navigator.clipboard.writeText(member.email);
                                                toast.success("Email copied to clipboard");
                                            }}
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Message
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div >
            )}

            {/* Empty State */}
            {
                filteredMembers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl mb-4">
                            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No members found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs text-center font-medium">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchTerm(""); setSelectedDepartment(null); }}
                            className="mt-4 text-blue-600 dark:text-blue-400 font-bold"
                        >
                            Clear all filters
                        </Button>
                    </div>
                )
            }
        </div >
    );
}

export default MyTeam;