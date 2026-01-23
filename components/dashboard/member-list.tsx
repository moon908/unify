"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Briefcase, Building2, User } from "lucide-react"

interface DBUser {
    name: string | null
    email: string | null
    role: string | null
    department: string | null
    image?: string | null
}

export function MemberList() {
    const [members, setMembers] = useState<DBUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true)
                const { data, error } = await supabase
                    .from('User')
                    .select('name, email, role, department, image')
                    .limit(10)

                if (error) throw error
                setMembers(data || [])
            } catch (error) {
                console.error('Error fetching members:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMembers()
    }, [])

    return (
        <Card className="border-none shadow-2xl bg-linear-to-br from-card/80 to-card/30 backdrop-blur-xl relative overflow-hidden group/card">
            {/* Animated background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

            <CardHeader className="pb-6 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                            Team Network
                        </CardTitle>
                        <CardDescription className="font-bold text-primary/80 uppercase tracking-widest text-[10px] mt-1">
                            List of Team Members
                        </CardDescription>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <div className="rounded-2xl overflow-hidden border border-border/10 bg-black/5 dark:bg-white/5 shadow-inner">
                    <Table>
                        <TableHeader className="bg-muted/30 sticky top-0 z-20 backdrop-blur-md">
                            <TableRow className="hover:bg-transparent border-border/10">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 pl-6 text-foreground/50">Member</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-foreground/50">Position</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 pr-6 text-foreground/50">Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3, 4].map((i) => (
                                        <TableRow key={`skeleton-${i}`} className="border-border/10">
                                            <TableCell colSpan={3} className="py-6 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-muted/20 animate-pulse" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-4 w-32 bg-muted/20 rounded-full animate-pulse" />
                                                        <div className="h-3 w-48 bg-muted/10 rounded-full animate-pulse" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : members.length > 0 ? (
                                    members.map((member, index) => (
                                        <motion.tr
                                            key={member.email || index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-border/10 hover:bg-primary/5 transition-all group/row cursor-default"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-11 w-11 border-2 border-border/50 shadow-md group-hover/row:border-primary/50 transition-all duration-300">
                                                        <AvatarImage src={member.image || ""} alt={member.name || ""} className="object-cover" />
                                                        <AvatarFallback className="text-xs font-black bg-primary/10 text-primary">
                                                            {member.name?.slice(0, 2).toUpperCase() || "UN"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold tracking-tight text-foreground group-hover/row:text-primary transition-colors">
                                                            {member.name || "Personnel"}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <Mail className="w-3 h-3 text-muted-foreground/60" />
                                                            <span className="text-[10px] text-muted-foreground font-medium lowercase">
                                                                {member.email || "pending verification"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 text-foreground/70 group-hover/row:bg-primary group-hover/row:text-primary-foreground transition-all border border-border/10">
                                                    <Briefcase className="w-2.5 h-2.5 mr-1.5 inline-block opacity-70" />
                                                    {member.role || "Specialist"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-md bg-muted/20 group-hover/row:bg-primary/20 transition-colors">
                                                        <Building2 className="w-3 h-3 text-muted-foreground group-hover/row:text-primary" />
                                                    </div>
                                                    <span className="text-xs font-bold text-muted-foreground/80 group-hover/row:text-foreground transition-colors whitespace-nowrap">
                                                        {member.department || "Resource"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <User className="size-12" />
                                                <span className="text-xs font-black uppercase tracking-[0.3em]">No Network Data</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
