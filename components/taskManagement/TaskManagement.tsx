"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus,
    Calendar,
    Flag,
    CheckCircle2,
    Clock,
    AlertCircle,
    Layout,
    Search,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams } from 'next/navigation';

// Types
export type Priority = 'low' | 'medium' | 'high';

export interface Workspace {
    id: string | number;
    project: string;
    color: string;
    iconColor: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
    columnId: string;
    workspaceId: string | number;
}

export interface Column {
    id: string;
    title: string;
}

const DEFAULT_COLUMNS: Column[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
];

// DEPARTMENTS removed in favor of dynamic workspaces

// Components
const TaskCard = ({ task, isOverlay, onDelete }: { task: Task; isOverlay?: boolean; onDelete?: (id: string) => void }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const priorityColors = {
        low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    };

    const priorityIcons = {
        low: <Clock className="w-3 h-3" />,
        medium: <AlertCircle className="w-3 h-3" />,
        high: <Flag className="w-3 h-3" />,
    };

    if (isDragging && !isOverlay) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-40 bg-slate-100 dark:bg-slate-800/50 h-[120px] rounded-2xl mb-4 border-2 border-dashed border-blue-200 dark:border-blue-900/50"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl mb-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing backdrop-blur-sm",
                isOverlay && "shadow-2xl ring-2 ring-blue-500/50 border-transparent rotate-2 scale-105 z-50 bg-white/90 dark:bg-slate-900/90"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider",
                    priorityColors[task.priority]
                )}>
                    {priorityIcons[task.priority]}
                    {task.priority}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(task.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 shadow-sm cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {task.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                {task.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KanbanColumn = ({ column, tasks, onAddTask, onDeleteTask }: { column: Column; tasks: Task[]; onAddTask: (columnId: string) => void; onDeleteTask: (id: string) => void }) => {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col w-[300px] min-w-[300px] h-full bg-slate-50/40 dark:bg-slate-950/20 rounded-[2rem] p-5 border border-slate-200/40 dark:border-slate-800/40 transition-all hover:bg-slate-50/60 dark:hover:bg-slate-950/30"
        >
            <div className="flex items-center justify-between mb-6 px-2 shrink-0">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        column.id === 'todo' && "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
                        column.id === 'in-progress' && "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
                        column.id === 'review' && "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
                        column.id === 'done' && "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                    )} />
                    <h2 className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
                        {column.title}
                    </h2>
                    <span className="bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px] border border-slate-200/50 dark:border-slate-800/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm backdrop-blur-sm">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={() => onAddTask(column.id)}
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-blue-500 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide py-1">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200/50 dark:border-slate-800/30 rounded-3xl bg-slate-50/30 dark:bg-slate-900/10 group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all" onClick={() => onAddTask(column.id)}>
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-3 group-hover:scale-110 transition-transform">
                                <Layout className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">No tasks yet</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | number | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Task Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as Priority,
        dueDate: new Date().toISOString().split('T')[0],
        columnId: 'todo'
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const searchParams = useSearchParams();
    const workspaceIdParam = searchParams.get('workspaceId');

    const fetchWorkspaces = async () => {
        setIsWorkspacesLoading(true);
        try {
            const { data, error } = await supabase
                .from('Workspace')
                .select('id, project, color, iconColor');

            if (error) throw error;
            setWorkspaces(data || []);

            // Priority: URL Param > First Workspace
            if (workspaceIdParam) {
                setSelectedWorkspaceId(workspaceIdParam);
            } else if (data && data.length > 0) {
                setSelectedWorkspaceId(data[0].id);
            }
        } catch (error: any) {
            console.error('Error fetching workspaces:', error.message);
            toast.error("Failed to load workspaces");
        } finally {
            setIsWorkspacesLoading(false);
        }
    };

    const fetchTasks = async (workspaceId: string | number) => {
        setIsLoading(true);
        console.log(`Fetching tasks for workspaceId: ${workspaceId}`);
        try {
            const { data, error } = await supabase
                .from('Task')
                .select('*')
                .eq('workspaceId', workspaceId);

            if (error) throw error;
            console.log(`Fetched ${data?.length || 0} tasks`);
            setTasks(data || []);
        } catch (error: any) {
            console.error('Error fetching tasks:', error.message);
            toast.error("Failed to load tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        if (selectedWorkspaceId) {
            fetchTasks(selectedWorkspaceId);
        }
    }, [selectedWorkspaceId]);

    const handleCreateTask = async () => {
        if (!newTask.title) {
            toast.error("Please fill in the title");
            return;
        }

        try {
            const taskToCreate = {
                ...newTask,
                workspaceId: selectedWorkspaceId,
            };

            const { data, error } = await supabase
                .from('Task')
                .insert([taskToCreate])
                .select();

            if (error) throw error;

            if (data) {
                setTasks(prev => [...prev, data[0]]);
                setIsCreateModalOpen(false);
                setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: new Date().toISOString().split('T')[0],
                    columnId: 'todo'
                });
                toast.success("Task created successfully");
            }
        } catch (error: any) {
            console.error('Error creating task:', error.message);
            toast.error("Failed to create task");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            console.log(`Deleting task: ${taskId}`);
            const { error } = await supabase
                .from('Task')
                .delete()
                .eq('id', taskId);

            if (error) throw error;

            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success("Task deleted successfully");
        } catch (error: any) {
            console.error('Error deleting task:', error.message);
            toast.error("Failed to delete task");
        }
    };

    const updateTaskStatus = async (taskId: string, columnId: string) => {
        try {
            console.log(`Updating task ${taskId} status to: ${columnId}`);
            const { data, error } = await supabase
                .from('Task')
                .update({ columnId })
                .eq('id', taskId)
                .select();

            if (error) throw error;
            if (data) console.log("Database update successful:", data);
        } catch (error: any) {
            console.error('Error updating task status:', error.message);
            toast.error("Failed to update task in database");
        }
    };

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Task') {
            const task = event.active.data.current.task;
            setActiveTask(task);
            setOriginalColumnId(task.columnId);
            console.log("Drag Start: Original column is", task.columnId);
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        // Moving between columns while dragging
        if (isOverATask) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);

                if (prev[activeIndex].columnId !== prev[overIndex].columnId) {
                    const newTasks = [...prev];
                    newTasks[activeIndex] = {
                        ...newTasks[activeIndex],
                        columnId: prev[overIndex].columnId
                    };
                    return arrayMove(newTasks, activeIndex, overIndex);
                }

                return arrayMove(prev, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === 'Column';

        if (isOverAColumn) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                if (prev[activeIndex].columnId !== overId) {
                    const newTasks = [...prev];
                    newTasks[activeIndex] = {
                        ...newTasks[activeIndex],
                        columnId: overId as string
                    };
                    return arrayMove(newTasks, activeIndex, activeIndex);
                }
                return prev;
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const currentActiveTask = activeTask;
        const startColumn = originalColumnId;

        setActiveTask(null);
        setOriginalColumnId(null);

        if (!over || !currentActiveTask) return;

        const activeId = active.id;
        const overId = over.id;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveATask) {
            let finalColumnId = currentActiveTask.columnId;

            // We need to find what the final columnId is after all drag overs
            // Since our state 'tasks' is updated during dragOver, we can find it there
            const taskInState = tasks.find(t => t.id === activeId);
            if (taskInState) {
                finalColumnId = taskInState.columnId;
            }

            if (startColumn !== finalColumnId) {
                console.log(`Column changed from ${startColumn} to ${finalColumnId}. Triggering update.`);
                toast.success(`Task moved to ${DEFAULT_COLUMNS.find(c => c.id === finalColumnId)?.title}`);
                updateTaskStatus(activeId as string, finalColumnId);
            } else {
                console.log("Column did not change. No update needed.");
            }
        }
    }

    return (
        <div className="p-8 h-screen flex flex-col bg-white dark:bg-[#020617] overflow-hidden">
            {/* Header section with glass effect */}
            <div className="flex items-center justify-between mb-8 shrink-0 relative">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 dark:opacity-40 animate-pulse" />
                        <div className="relative p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-blue-500/30 -rotate-3 hover:rotate-0 transition-all duration-500 transform-gpu cursor-pointer">
                            <Layout className="w-8 h-8" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tight">
                                Task Center
                            </h1>
                            <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-blue-100 dark:border-blue-800">
                                Enterprise
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                Manage and track your industrial workflow
                            </p>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{tasks.filter(t => t.columnId === 'done').length} Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-blue-500/20 active:scale-95 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create Task
                </button>
            </div>

            {/* Workspace Selection Bar - Premium Tabs */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide shrink-0 px-2">
                {isWorkspacesLoading ? (
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : workspaces.length > 0 ? (
                    workspaces.map((workspace) => (
                        <button
                            key={workspace.id}
                            onClick={() => setSelectedWorkspaceId(workspace.id)}
                            className={cn(
                                "group relative px-6 py-3 rounded-2xl text-[13px] font-black transition-all whitespace-nowrap overflow-hidden transform-gpu",
                                selectedWorkspaceId === workspace.id
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.05)] scale-105"
                                    : "bg-white dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {workspace.project}
                                {selectedWorkspaceId === workspace.id && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-[9px] font-bold">
                                        {tasks.length}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="flex items-center gap-4 py-2 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No workspaces found. Create one in the Workspaces tab.</p>
                    </div>
                )}
            </div>

            {/* Kanban Board with Drag and Drop */}
            <div className="flex-1 min-h-0">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <div className="flex gap-8 h-full overflow-x-auto pb-10 scrollbar-hide select-none px-2">
                        {DEFAULT_COLUMNS.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                tasks={tasks.filter((t) => t.columnId === column.id)}
                                onAddTask={(columnId) => {
                                    setNewTask(prev => ({ ...prev, columnId }));
                                    setIsCreateModalOpen(true);
                                }}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </div>

                    <DragOverlay
                        dropAnimation={{
                            sideEffects: defaultDropAnimationSideEffects({
                                styles: {
                                    active: {
                                        opacity: '0.5',
                                    },
                                },
                            }),
                        }}
                    >
                        {activeTask ? (
                            <TaskCard task={activeTask} isOverlay onDelete={handleDeleteTask} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Premium Create Task Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-slate-950/95 border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-[2.5rem] shadow-3xl p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                                <Plus className="w-6 h-6" />
                            </div>
                            Create New Task
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-8 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title" className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Task Title</Label>
                            <Input
                                id="title"
                                placeholder="What needs to be done?"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl h-14 px-5 text-lg font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all border-2 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description" className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add more details about this task..."
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-[1.5rem] min-h-[140px] px-5 py-4 text-base font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all border-2 resize-none text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="priority" className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Priority</Label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as Priority })}
                                >
                                    <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl h-12 px-5 font-bold border-2 text-slate-900 dark:text-white">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-2">
                                        <SelectItem value="low" className="font-bold">Low Priority</SelectItem>
                                        <SelectItem value="medium" className="font-bold">Medium Priority</SelectItem>
                                        <SelectItem value="high" className="font-bold text-rose-500">High Priority</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="dueDate" className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl h-12 px-5 font-bold border-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="column" className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Initial Status</Label>
                            <Select
                                value={newTask.columnId}
                                onValueChange={(value) => setNewTask({ ...newTask, columnId: value })}
                            >
                                <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl h-12 px-5 font-bold border-2 text-slate-900 dark:text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-2">
                                    {DEFAULT_COLUMNS.map(col => (
                                        <SelectItem key={col.id} value={col.id} className="font-bold">{col.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="mt-10 sm:justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 -mx-8 -mb-8 rounded-b-[2.5rem] border-t border-slate-200/50 dark:border-slate-800/50">
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            Auto-saving draft
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-8 py-3 text-sm font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest"
                            >
                                Create Task
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}