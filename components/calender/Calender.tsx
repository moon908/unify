"use client";

import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Settings,
    HelpCircle,
    Menu,
    Calendar as CalendarIcon,
    ChevronDown,
    Clock,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { INITIAL_MEETINGS, INITIAL_TASKS, CalendarEvent } from '@/constants/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Calender = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // Set to May 2024 to match mock data
    const [selectedView, setSelectedView] = useState<'Day' | 'Week' | 'Month' | 'Schedule'>('Month');
    const [activeCalendars, setActiveCalendars] = useState(['Meetings', 'Tasks']);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Generate days for the grid (including padding from prev/next months)
    const calendarDays = [];

    // Padding from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevMonthDays - i,
            month: month - 1,
            year: year,
            isCurrentMonth: false
        });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }

    // Padding for next month to fill 6 rows (42 days)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            day: i,
            month: month + 1,
            year: year,
            isCurrentMonth: false
        });
    }

    const nextView = () => {
        if (selectedView === 'Month') {
            setCurrentDate(new Date(year, month + 1, 1));
        } else if (selectedView === 'Week') {
            setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
        } else if (selectedView === 'Day') {
            setCurrentDate(new Date(year, month, currentDate.getDate() + 1));
        }
    };

    const prevView = () => {
        if (selectedView === 'Month') {
            setCurrentDate(new Date(year, month - 1, 1));
        } else if (selectedView === 'Week') {
            setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
        } else if (selectedView === 'Day') {
            setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
        }
    };

    const goToToday = () => setCurrentDate(new Date());

    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push({
                day: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear(),
                isCurrentMonth: d.getMonth() === month
            });
        }
        return days;
    };

    const getEventsForDay = (day: number, m: number, y: number) => {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const meetings = INITIAL_MEETINGS.filter(meeting => meeting.start.startsWith(dateStr));
        const tasks = INITIAL_TASKS.filter(task => task.dueDate === dateStr);

        return {
            meetings: activeCalendars.includes('Meetings') ? meetings : [],
            tasks: activeCalendars.includes('Tasks') ? tasks : []
        };
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4">
                        <CalendarIcon className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-medium tracking-tight">Calendar</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={goToToday}
                        className="rounded-md px-4 font-medium border-slate-200 dark:border-slate-800"
                    >
                        Today
                    </Button>
                    <div className="flex items-center gap-1 ml-2">
                        <Button variant="ghost" size="icon" onClick={prevView} className="rounded-full h-8 w-8">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextView} className="rounded-full h-8 w-8">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-medium ml-4">
                        {selectedView === 'Day' ? `${currentDate.getDate()} ` : ''}
                        {MONTHS[month]} {year}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 mr-4">
                        {['Day', 'Week', 'Month'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setSelectedView(view as any)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                    selectedView === view
                                        ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                )}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 p-4 gap-8">
                    <Button className="w-full justify-start gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm h-12 rounded-full px-6 group transition-all">
                        <Plus className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Create</span>
                        <ChevronDown className="w-4 h-4 ml-auto text-slate-400" />
                    </Button>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-2">
                            My Calendars
                        </h3>
                        <div className="space-y-1">
                            {[
                                { id: 'Meetings', color: 'bg-blue-500' },
                                { id: 'Tasks', color: 'bg-emerald-500' },
                                { id: 'Reminders', color: 'bg-purple-500' },
                                { id: 'Birthdays', color: 'bg-orange-500' }
                            ].map((cal) => (
                                <label key={cal.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer group transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={activeCalendars.includes(cal.id)}
                                            onChange={() => {
                                                if (activeCalendars.includes(cal.id)) {
                                                    setActiveCalendars(activeCalendars.filter(id => id !== cal.id));
                                                } else {
                                                    setActiveCalendars([...activeCalendars, cal.id]);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cal.id}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto mb-12 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Next Meeting</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Team Sync</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">10:00 AM - 11:30 AM</p>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0">
                    <AnimatePresence mode="wait">
                        {selectedView === 'Month' && (
                            <motion.div
                                key="month"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
                                    {DAYS.map((day) => (
                                        <div key={day} className="py-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr overflow-y-auto scrollbar-hide">
                                    {calendarDays.map((date, idx) => {
                                        const { meetings, tasks } = getEventsForDay(date.day, date.month, date.year);
                                        const isToday = new Date().toDateString() === new Date(date.year, date.month, date.day).toDateString();

                                        return (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "border-r border-b border-slate-100 dark:border-slate-800/50 p-2 min-h-[120px] transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/20",
                                                    !date.isCurrentMonth && "bg-slate-50/30 dark:bg-slate-900/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                                                        isToday
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-115"
                                                            : date.isCurrentMonth ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"
                                                    )}>
                                                        {date.day}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 overflow-hidden">
                                                    {meetings.map((meeting) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -5 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            key={meeting.id}
                                                            className={cn(
                                                                "px-2 py-1 rounded text-[10px] font-bold truncate transition-all cursor-pointer hover:brightness-110",
                                                                meeting.color,
                                                                "text-white shadow-sm"
                                                            )}
                                                        >
                                                            {meeting.title}
                                                        </motion.div>
                                                    ))}
                                                    {tasks.map((task) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -5 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            key={task.id}
                                                            className="px-2 py-1 bg-emerald-500 dark:bg-emerald-600 rounded text-[10px] font-bold text-white truncate shadow-sm cursor-pointer hover:brightness-110 flex items-center gap-1"
                                                        >
                                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                                            {task.title}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {selectedView === 'Week' && (
                            <motion.div
                                key="week"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
                                    {getWeekDays().map((date, idx) => (
                                        <div key={idx} className="py-4 text-center border-r border-slate-100 dark:border-slate-800/50">
                                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                                {DAYS[idx]}
                                            </div>
                                            <div className={cn(
                                                "w-10 h-10 mx-auto flex items-center justify-center rounded-full text-lg font-bold transition-all",
                                                new Date().toDateString() === new Date(date.year, date.month, date.day).toDateString()
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                                                    : "text-slate-900 dark:text-white"
                                            )}>
                                                {date.day}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 grid grid-cols-7 overflow-y-auto scrollbar-hide">
                                    {getWeekDays().map((date, idx) => {
                                        const { meetings, tasks } = getEventsForDay(date.day, date.month, date.year);
                                        return (
                                            <div key={idx} className="border-r border-slate-100 dark:border-slate-800/50 p-4 min-h-[500px] bg-slate-50/10">
                                                <div className="space-y-3">
                                                    {meetings.map((meeting) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            key={meeting.id}
                                                            className={cn(
                                                                "p-3 rounded-xl text-xs font-bold transition-all cursor-pointer hover:shadow-md",
                                                                meeting.color,
                                                                "text-white shadow-sm border border-white/20"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{meeting.start.split('T')[1].substring(0, 5)}</span>
                                                            </div>
                                                            {meeting.title}
                                                        </motion.div>
                                                    ))}
                                                    {tasks.map((task) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            key={task.id}
                                                            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                                        >
                                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] uppercase tracking-wider">Task</span>
                                                            </div>
                                                            {task.title}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {selectedView === 'Day' && (
                            <motion.div
                                key="day"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col p-8 bg-slate-50/30 dark:bg-transparent overflow-y-auto scrollbar-hide"
                            >
                                <div className="max-w-4xl mx-auto w-full space-y-8">
                                    <div className="flex items-end gap-6 mb-12">
                                        <h1 className="text-6xl font-black text-slate-900 dark:text-white leading-none">
                                            {currentDate.getDate()}
                                        </h1>
                                        <div className="pb-1">
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none mb-2">
                                                {DAYS[currentDate.getDay()]}
                                            </p>
                                            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-none">
                                                {MONTHS[month]} {year}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Schedule for Today</h3>
                                    {(() => {
                                        const { meetings, tasks } = getEventsForDay(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
                                        if (meetings.length === 0 && tasks.length === 0) {
                                            return (
                                                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white/50 dark:bg-slate-900/50">
                                                    <CalendarIcon className="w-12 h-12 text-slate-300 mb-4" />
                                                    <p className="text-slate-500 font-bold">No events scheduled for today</p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="grid gap-4">
                                                {meetings.map((meeting) => (
                                                    <motion.div
                                                        key={meeting.id}
                                                        whileHover={{ scale: 1.01 }}
                                                        className={cn(
                                                            "flex items-center gap-6 p-6 rounded-[2rem] shadow-sm border border-white/20",
                                                            meeting.color,
                                                            "text-white"
                                                        )}
                                                    >
                                                        <div className="w-20 text-center border-r border-white/20 pr-6">
                                                            <p className="text-sm font-black">{meeting.start.split('T')[1].substring(0, 5)}</p>
                                                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Start</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black mb-1">{meeting.title}</h4>
                                                            <p className="text-sm font-medium opacity-80">{meeting.description || 'No description'}</p>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                                                                <MoreVertical className="w-5 h-5" />
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {tasks.map((task) => (
                                                    <motion.div
                                                        key={task.id}
                                                        whileHover={{ scale: 1.01 }}
                                                        className="flex items-center gap-6 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                                                    >
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-slate-900 dark:text-white">{task.title}</h4>
                                                            <p className="text-sm font-bold text-slate-500">Workspace Task</p>
                                                        </div>
                                                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-black px-4 py-1.5">
                                                            DUE TODAY
                                                        </Badge>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Calender;