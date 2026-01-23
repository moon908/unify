
export type Priority = 'low' | 'medium' | 'high';

export interface Workspace {
    id: string;
    name: string;
    icon?: string;
}

export interface Task {
    id: string;
    columnId: string;
    workspaceId: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: string; // ISO string or YYYY-MM-DD HH:mm
    end: string;
    type: 'meeting' | 'task' | 'deadline';
    color: string;
}

export const WORKSPACES: Workspace[] = [
    { id: 'engineering', name: 'Engineering' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'design', name: 'Design' },
    { id: 'product', name: 'Product' },
];

export const INITIAL_TASKS: Task[] = [
    // Engineering
    {
        id: '1',
        columnId: 'todo',
        workspaceId: 'engineering',
        title: 'Design System Update',
        description: 'Update the primary color palette and component tokens.',
        priority: 'high',
        dueDate: '2024-05-20',
    },
    {
        id: '2',
        columnId: 'todo',
        workspaceId: 'engineering',
        title: 'Auth Integration',
        description: 'Implement Clerk authentication for the dashboard.',
        priority: 'medium',
        dueDate: '2024-05-22',
    },
    // Marketing
    {
        id: '3',
        columnId: 'in-progress',
        workspaceId: 'marketing',
        title: 'Landing Page Revamp',
        description: 'Create a more engaging hero section with animations.',
        priority: 'high',
        dueDate: '2024-05-18',
    },
    {
        id: '4',
        columnId: 'review',
        workspaceId: 'engineering',
        title: 'Bug: Sidebar Layout',
        description: 'Fix the overflow issue on mobile devices.',
        priority: 'low',
        dueDate: '2024-05-15',
    },
    {
        id: '5',
        columnId: 'done',
        workspaceId: 'engineering',
        title: 'Project Setup',
        description: 'Initialize Next.js project with Tailwind CSS.',
        priority: 'medium',
        dueDate: '2024-05-10',
    },
    // Design
    {
        id: '6',
        columnId: 'todo',
        workspaceId: 'design',
        title: 'Logo Redesign',
        description: 'Explore new concepts for the company logo.',
        priority: 'high',
        dueDate: '2024-06-01',
    },
    {
        id: '7',
        columnId: 'in-progress',
        workspaceId: 'design',
        title: 'Mobile App Mockups',
        description: 'Finalize the UI mockups for the new mobile companion app.',
        priority: 'medium',
        dueDate: '2024-06-05',
    },
    // Product
    {
        id: '8',
        columnId: 'todo',
        workspaceId: 'product',
        title: 'Roadmap Planning Q3',
        description: 'Define key milestones and features for the next quarter.',
        priority: 'high',
        dueDate: '2024-06-15',
    }
];

export const INITIAL_MEETINGS: CalendarEvent[] = [
    {
        id: 'm1',
        title: 'Team Sync',
        description: 'Weekly team synchronization meeting',
        start: '2024-05-20T10:00:00',
        end: '2024-05-20T11:00:00',
        type: 'meeting',
        color: 'bg-blue-500'
    },
    {
        id: 'm2',
        title: 'Design Review',
        description: 'Reviewing new UI mockups',
        start: '2024-05-21T14:00:00',
        end: '2024-05-21T15:30:00',
        type: 'meeting',
        color: 'bg-purple-500'
    },
    {
        id: 'm3',
        title: 'Product Roadmap',
        description: 'Planning for Q3 milestones',
        start: '2024-05-22T09:00:00',
        end: '2024-05-22T10:30:00',
        type: 'meeting',
        color: 'bg-emerald-500'
    },
    {
        id: 'm4',
        title: 'Client Demo',
        description: 'Showing the latest features to the client',
        start: '2024-05-18T16:00:00',
        end: '2024-05-18T17:00:00',
        type: 'meeting',
        color: 'bg-orange-500'
    },
    {
        id: 'm5',
        title: 'Engineering Sprint Planning',
        description: 'Setting goals for the next sprint',
        start: '2024-05-24T11:00:00',
        end: '2024-05-24T12:30:00',
        type: 'meeting',
        color: 'bg-blue-600'
    }
];

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    initials: string;
    image?: string;
}

export interface NotificationItem {
    id: string;
    type: 'mention' | 'assignment' | 'deadline' | 'system';
    sender: {
        name: string;
        initials: string;
        image?: string;
    };
    title: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    workspace?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: '1',
        type: 'mention',
        sender: { name: 'Alex Doe', initials: 'AD', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' },
        title: 'Mentioned you in Design System',
        content: 'Hey @Siddharth, can you take a look at the new color palette updates? I think we need a warmer indigo.',
        timestamp: '2 mins ago',
        isRead: false,
        workspace: 'Engineering'
    },
    {
        id: '2',
        type: 'assignment',
        sender: { name: 'Jane Wilson', initials: 'JW' },
        title: 'Assigned a new task',
        content: 'You have been assigned to "Landing Page Revamp - Hero Section". Priority: High.',
        timestamp: '1 hour ago',
        isRead: false,
        workspace: 'Marketing'
    },
    {
        id: '3',
        type: 'deadline',
        sender: { name: 'System', initials: 'SY' },
        title: 'Deadline Approaching',
        content: 'The milestone "Phase 1 Beta" is due in 24 hours. 3 tasks still pending.',
        timestamp: '3 hours ago',
        isRead: true,
        workspace: 'Product'
    },
    {
        id: '4',
        type: 'mention',
        sender: { name: 'Sam Smith', initials: 'SS', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
        title: 'Replied to your comment',
        content: '"The animations look great! Should we use Framer Motion for the entire transition?"',
        timestamp: '5 hours ago',
        isRead: true,
        workspace: 'Engineering'
    },
    {
        id: '5',
        type: 'system',
        sender: { name: 'System', initials: 'SY' },
        title: 'Project Setup Complete',
        content: 'The workspace "Internal Tools" has been successfully initialized and repo connected.',
        timestamp: 'Yesterday',
        isRead: true,
        workspace: 'Infrastructure'
    }
];
