"use client"

import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts"
import { supabase } from "@/lib/supabase/client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "Task Status Bar Chart"

const chartConfig = {
    tasks: {
        label: "Tasks",
    },
    todo: {
        label: "To Do",
        color: "var(--chart-1)",
    },
    "in-progress": {
        label: "In Progress",
        color: "var(--chart-2)",
    },
    review: {
        label: "Review",
        color: "var(--chart-3)",
    },
    done: {
        label: "Done",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

export function MyBarChart() {
    const [chartData, setChartData] = React.useState<any[]>([
        { status: "todo", tasks: 0, fill: "var(--chart-1)" },
        { status: "in-progress", tasks: 0, fill: "var(--chart-2)" },
        { status: "review", tasks: 0, fill: "var(--chart-3)" },
        { status: "done", tasks: 0, fill: "var(--chart-4)" },
    ]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTaskDistribution = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('Task')
                    .select('columnId');

                if (error) throw error;

                const counts = (data || []).reduce((acc: any, task: any) => {
                    const status = task.columnId;
                    if (['todo', 'in-progress', 'review', 'done'].includes(status)) {
                        acc[status] = (acc[status] || 0) + 1;
                    }
                    return acc;
                }, { todo: 0, "in-progress": 0, review: 0, done: 0 });

                const updatedData = [
                    { status: "todo", label: "To Do", tasks: counts["todo"], fill: "var(--chart-1)" },
                    { status: "in-progress", label: "In Progress", tasks: counts["in-progress"], fill: "var(--chart-2)" },
                    { status: "review", label: "Review", tasks: counts["review"], fill: "var(--chart-3)" },
                    { status: "done", label: "Done", tasks: counts["done"], fill: "var(--chart-4)" },
                ];

                setChartData(updatedData);
            } catch (error) {
                console.error('Error fetching task distribution for bar chart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaskDistribution();
    }, []);

    return (
        <Card className="flex flex-col h-full border-none shadow-2xl bg-linear-to-br from-card/80 to-card/30 backdrop-blur-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Task Metrics
                </CardTitle>
                <CardDescription className="font-bold text-primary/80 uppercase tracking-tighter text-[10px]">
                    Project Velocity Tracking
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 relative z-10">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full"
                >
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 10, fontWeight: 700 }}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'currentColor', opacity: 0.05 }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="tasks"
                            radius={[6, 6, 0, 0]}
                            barSize={40}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm pt-4 border-t border-border/10 relative z-10 bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2 leading-none font-extrabold text-foreground/80 lowercase tracking-tight">
                    Workflow Performance <IconTrendingUp className="size-4 text-emerald-500" />
                </div>
                <div className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
                    Real-time data stream
                </div>
            </CardFooter>
        </Card>
    )
}
