"use client";

import React, { useEffect, useState } from "react"
import { Users, Layout, Clock, ChevronRight, MoreHorizontal, Settings2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface WorkspaceItem {
    id: number | string;
    project: string;
    description: string;
    lastUpdate: string;
    status: boolean;
    color: string;
    iconColor: string;
}

interface WorkspaceCardProps {
    onAddClick?: () => void;
}

const WorkspaceCard = ({ onAddClick }: WorkspaceCardProps) => {
    const router = useRouter();
    const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('Workspace')
                    .select('id, project, description, lastUpdate, status, color, iconColor');

                if (error) throw error;

                if (data && data.length > 0) {
                    setWorkspaces(data);
                } else {
                    console.warn('Workspace table is empty.');
                }
            } catch (error: any) {
                console.error('Error fetching workspaces:', error.message);
                toast.error("Failed to load workspaces.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-[300px] animate-pulse bg-slate-100 dark:bg-slate-800/50 border-none" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {workspaces.map((workspace) => (
                <Card
                    key={workspace.id}
                    className="group relative overflow-hidden border-none shadow-lg bg-linear-to-br from-card/80 to-card/30 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 border border-white/5"
                >
                    {/* Decorative Background Gradient */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${workspace.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Layout className={`size-6 ${workspace.iconColor}`} />
                            </div>
                            <Button variant="ghost" size="icon" className="size-8 rounded-full">
                                <MoreHorizontal className="size-4 text-muted-foreground" />
                            </Button>
                        </div>
                        <div className="mt-4 space-y-1">
                            <CardTitle className="text-xl font-bold tracking-tight text-black">
                                {workspace.project}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {workspace.description}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        {/* Members & Tasks Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-3 overflow-hidden">
                                {/* Avatars could be added here if needed */}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="size-3.5" />
                                    <span>Last Updated {workspace.lastUpdate}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0 border-t border-white/5 mt-2">
                        <div className="flex items-center justify-between w-full pt-4">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 border-none",
                                    workspace.status
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                                )}
                            >
                                {workspace.status ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="group/btn text-xs font-bold gap-1 hover:bg-primary/10 hover:text-primary transition-all"
                                onClick={() => router.push(`/taskManagement?workspaceId=${workspace.id}`)}
                            >
                                View Task <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}

            {/* Empty State / Add Card */}
            <Card id="new-card"
                onClick={onAddClick}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group min-h-[300px]"
            >
                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                    <Plus className="size-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground/50">New Hub</h3>
                <p className="text-xs text-muted-foreground/30 mt-1 uppercase tracking-widest">Connect Project</p>
            </Card>
        </div>
    )
}

export default WorkspaceCard
