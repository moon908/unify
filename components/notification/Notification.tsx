"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    MessageSquare,
    UserPlus,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Search,
    Check,
    Trash2,
    Filter,
    AtSign,
    ClipboardList
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { INITIAL_NOTIFICATIONS, NotificationItem } from '@/constants/constants'

const Notification = () => {
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

    const handleMarkRead = (id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    }

    const handleMarkAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const handleDelete = (id: string) => {
        setNotifs(prev => prev.filter(n => n.id !== id))
    }

    const filteredNotifications = notifs.filter(n => {
        if (activeTab === 'unread') return !n.isRead
        if (activeTab === 'mentions') return n.type === 'mention'
        return true
    }).filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'mention': return { icon: <AtSign className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' }
            case 'assignment': return { icon: <ClipboardList className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' }
            case 'deadline': return { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' }
            default: return { icon: <Bell className="w-4 h-4" />, color: 'bg-zinc-100 text-zinc-600' }
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50/50 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 rounded-2xl text-white shadow-lg">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Notifications</h1>
                            <p className="text-sm font-medium text-zinc-500">You have {notifs.filter(n => !n.isRead).length} unread updates</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        >
                            <Check className="w-4 h-4 mr-2" /> Mark all read
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                        <TabsList className="bg-white border border-zinc-200 p-1 rounded-2xl h-12">
                            <TabsTrigger value="all" className="rounded-xl px-6 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">All</TabsTrigger>
                            <TabsTrigger value="unread" className="rounded-xl px-6 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">Unread</TabsTrigger>
                            <TabsTrigger value="mentions" className="rounded-xl px-6 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">Mentions</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                        <Input
                            placeholder="Find a notification..."
                            className="pl-11 rounded-2xl border-zinc-200 bg-white h-12 focus-visible:ring-zinc-900 transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Notification List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif, idx) => {
                                const styles = getTypeStyles(notif.type)
                                return (
                                    <motion.div
                                        key={notif.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                    >
                                        <Card className={`group relative transition-all duration-300 rounded-[2rem] border-zinc-200 hover:border-zinc-300 hover:shadow-md ${!notif.isRead ? 'bg-zinc-50/80 border-l-4 border-l-zinc-900' : 'bg-white'}`}>
                                            <CardContent className="p-6">
                                                <div className="flex gap-4">
                                                    <Avatar className="w-12 h-12 rounded-2xl shadow-sm border border-zinc-100">
                                                        <AvatarImage src={notif.sender.image} />
                                                        <AvatarFallback className="bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                                                            {notif.sender.initials}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className={`font-bold tracking-tight transition-colors ${!notif.isRead ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                                                                    {notif.title}
                                                                </h3>
                                                                {!notif.isRead && (
                                                                    <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{notif.timestamp}</span>
                                                        </div>

                                                        <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>
                                                            {notif.content}
                                                        </p>

                                                        <div className="flex items-center justify-between gap-3 pt-2">
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="secondary" className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.color}`}>
                                                                    {styles.icon}
                                                                    {notif.type}
                                                                </Badge>
                                                                {notif.workspace && (
                                                                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-zinc-400 border-zinc-200 uppercase tracking-wider">
                                                                        {notif.workspace}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {!notif.isRead && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarkRead(notif.id);
                                                                    }}
                                                                    className="h-8 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 px-3 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
                                                                >
                                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                                    Mark as read
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(notif.id);
                                                            }}
                                                            className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-zinc-200"
                            >
                                <div className="p-4 bg-zinc-50 rounded-full text-zinc-300">
                                    <Bell className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900">All caught up!</h3>
                                    <p className="text-sm font-medium text-zinc-500">No notifications found in this category.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

export default Notification

