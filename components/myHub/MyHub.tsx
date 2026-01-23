"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Hash,
    Users,
    MoreVertical,
    Search,
    Settings,
    Smile,
    Plus,
    MessageCircle,
    ChevronDown,
    Pin,
    Phone,
    Video,
    AtSign,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WORKSPACES as MOCK_WORKSPACES } from '@/constants/constants';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase/client';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    reactions?: string[];
}

interface ChatRoom {
    id: string;
    name: string;
    workspaceId: string;
    description: string;
    membersCount: number;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
    'eng-general': [
        { id: '1', senderId: '1', text: "Hey team, did we finalize the auth integration?", timestamp: "10:30 AM" },
        { id: '2', senderId: '3', text: "Almost, just fixing a minor issue with the Clerk redirect.", timestamp: "10:32 AM" },
        { id: '3', senderId: '1', text: "Great, let me know when I can review it.", timestamp: "10:35 AM" }
    ],
    'mkt-social': [
        { id: '4', senderId: '2', text: "The LinkedIn post for the launch is ready!", timestamp: "09:15 AM" },
        { id: '5', senderId: '8', text: "Awesome! Checking the graphics now.", timestamp: "09:20 AM" }
    ]
};

// Local types for Supabase data
interface DBWorkspace {
    id: string | number;
    project: string;
}

interface DBChatCategory {
    id: string | number;
    category: string;
    workspaceId: string | number;
}

const MOCK_CHAT_ROOMS: ChatRoom[] = [
    { id: 'eng-general', name: 'general', workspaceId: 'engineering', description: 'Engineering team announcements', membersCount: 15 },
    { id: 'eng-dev', name: 'dev-chat', workspaceId: 'engineering', description: 'Code discussions and PRs', membersCount: 12 },
    { id: 'mkt-social', name: 'social-media', workspaceId: 'marketing', description: 'Scheduling and content review', membersCount: 8 },
    { id: 'design-sync', name: 'design-sync', workspaceId: 'design', description: 'Weekly UI/UX review', membersCount: 5 },
    { id: 'prod-roadmap', name: 'roadmap-q3', workspaceId: 'product', description: 'Planning the next big things', membersCount: 10 }
];

const MOCK_MEMBERS = [
    { id: '1', name: 'Sarah Chen', initials: 'SC', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: '2', name: 'Marcus Rodriguez', initials: 'MR', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { id: '3', name: 'Emily Watson', initials: 'EW' },
    { id: '8', name: 'James Wilson', initials: 'JW' },
    { id: 'currentUser', name: 'Me', initials: 'ME' }
];

const MyHub = () => {
    const [selectedRoomId, setSelectedRoomId] = useState<string | number>('eng-general');
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
    const [workspaces, setWorkspaces] = useState<DBWorkspace[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch Workspaces
                const { data: wsData, error: wsError } = await supabase
                    .from('Workspace')
                    .select('id, project');

                if (wsError) throw wsError;

                // Fetch ChatCategories
                const { data: catData, error: catError } = await supabase
                    .from('ChatCategory')
                    .select('id, category, workspaceId');

                if (catError) throw catError;

                if (wsData && catData) {
                    setWorkspaces(wsData);

                    const rooms: ChatRoom[] = catData.map(cat => ({
                        id: cat.id,
                        name: cat.category,
                        workspaceId: cat.workspaceId,
                        description: `Discussion for ${cat.category}`,
                        membersCount: Math.floor(Math.random() * 20) + 5 // Mock members count for now
                    }));

                    setChatRooms(rooms);

                    if (rooms.length > 0) {
                        setSelectedRoomId(rooms[0].id);
                    }
                }
            } catch (error: any) {
                console.error('Error fetching data from Supabase:', error.message);
                // Fallback to mock data
                setWorkspaces(MOCK_WORKSPACES.map(ws => ({ id: ws.id, project: ws.name })));
                setChatRooms(MOCK_CHAT_ROOMS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const selectedRoom = chatRooms.find(r => r.id === selectedRoomId) || chatRooms[0] || MOCK_CHAT_ROOMS[0];
    const currentMessages = messages[selectedRoomId.toString()] || [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedRoomId, messages]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'currentUser', // Mocking current user
            text: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
            ...prev,
            [selectedRoomId]: [...(prev[selectedRoomId] || []), newMessage]
        }));
        setMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-[#020617] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 m-4 shadow-2xl">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-transparent relative">
                {/* Chat Header */}
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Hash className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                {selectedRoom.name}
                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2 py-0">
                                    {selectedRoom.membersCount} members
                                </Badge>
                            </h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[400px]">
                                {selectedRoom.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Phone className="w-5 h-5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Video className="w-5 h-5 text-slate-500" />
                        </Button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </header>

                {/* Messages List */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
                >
                    <AnimatePresence mode="popLayout">
                        {currentMessages.map((msg, idx) => {
                            const sender = MOCK_MEMBERS.find(m => m.id === msg.senderId);
                            const isMe = msg.senderId === 'currentUser';

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-4 group",
                                        isMe ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                                        <AvatarImage src={sender?.image} />
                                        <AvatarFallback className={cn(
                                            "font-black text-white text-xs",
                                            isMe ? "bg-blue-600" : "bg-gradient-to-br from-slate-500 to-slate-700"
                                        )}>
                                            {isMe ? 'ME' : sender?.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "flex flex-col gap-1.5 max-w-[70%]",
                                        isMe ? "items-end" : "items-start"
                                    )}>
                                        {!isMe && (
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                                                {sender?.name}
                                            </span>
                                        )}
                                        <div className={cn(
                                            "px-4 py-3 rounded-2xl shadow-sm relative group",
                                            isMe
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800"
                                        )}>
                                            <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                                            <span className={cn(
                                                "text-[10px] opacity-50 font-bold mt-1 block",
                                                isMe ? "text-blue-100 text-right" : "text-slate-400"
                                            )}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Input
                                placeholder={`Message #${selectedRoom.name}`}
                                className="h-14 pl-14 pr-12 bg-slate-100 dark:bg-slate-900/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500 font-medium text-slate-900 dark:text-white"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                                    <Plus className="w-5 h-5 text-slate-500" />
                                </Button>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                                    <Smile className="w-5 h-5 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                                    <AtSign className="w-5 h-5 text-slate-500" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                            onClick={handleSendMessage}
                        >
                            <Send className="w-6 h-6 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Chat Rooms */}
            <aside className="w-[320px] border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-[#020617]">
                <div className="p-6 h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Rooms</h3>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                        <Search className="w-5 h-5 text-slate-500" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : workspaces.length > 0 ? (
                        workspaces.map(workspace => {
                            const rooms = chatRooms.filter(r => String(r.workspaceId) === String(workspace.id));
                            if (rooms.length === 0) return null;

                            return (
                                <div key={workspace.id} className="space-y-3">
                                    <div className="flex items-center justify-between px-3 group">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                                            {workspace.project}
                                        </span>
                                        <Plus className="w-4 h-4 text-slate-300 transition-all hover:text-blue-500 cursor-pointer" />
                                    </div>
                                    <div className="space-y-1">
                                        {rooms.map(room => (
                                            <button
                                                key={room.id}
                                                onClick={() => setSelectedRoomId(room.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group text-left",
                                                    selectedRoomId === room.id
                                                        ? "bg-blue-500/10 text-blue-600"
                                                        : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-1.5 rounded-lg transition-colors",
                                                    selectedRoomId === room.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    <Hash className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1 truncate">
                                                    <p className="text-sm font-bold tracking-tight truncate">
                                                        {room.name}
                                                    </p>
                                                    <p className="text-[10px] font-medium opacity-60">
                                                        {room.membersCount} online
                                                    </p>
                                                </div>
                                                {selectedRoomId === room.id && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="w-1 h-6 bg-blue-600 rounded-full"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-sm text-slate-500">No rooms found</p>
                        </div>
                    )}
                </div>

                {/* Footer Section in Sidebar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 m-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                            <Layout className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Activity</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">48+ Unread</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default MyHub;