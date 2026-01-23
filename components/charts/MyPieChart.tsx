"use client"

import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Label, Pie, PieChart } from "recharts"
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

export const description = "Workspace Status Distribution"

const chartConfig = {
    workspaces: {
        label: "Workspaces",
    },
    active: {
        label: "Active",
        color: "var(--chart-1)",
    },
    inactive: {
        label: "Inactive",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function MyPieChart() {
    const [chartData, setChartData] = React.useState<any[]>([
        { status: "active", count: 0, fill: "var(--color-active)" },
        { status: "inactive", count: 0, fill: "var(--color-inactive)" },
    ]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchWorkspaceStatus = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('Workspace')
                    .select('status');

                if (error) throw error;

                const counts = (data || []).reduce((acc: any, ws: any) => {
                    const key = ws.status ? 'active' : 'inactive';
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, { active: 0, inactive: 0 });

                const updatedData = [
                    { status: "active", count: counts.active, fill: "var(--color-active)" },
                    { status: "inactive", count: counts.inactive, fill: "var(--color-inactive)" },
                ];

                setChartData(updatedData);
            } catch (error) {
                console.error('Error fetching workspace status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaceStatus();
    }, []);

    const totalWorkspaces = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])

    return (
        <Card className="flex flex-col h-full border-none shadow-2xl bg-linear-to-br from-card/80 to-card/30 backdrop-blur-xl relative overflow-hidden">
            {/* Subtle radial gradient for depth */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

            <CardHeader className="items-center pb-0 relative z-10">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Workspace Status
                </CardTitle>
                <CardDescription className="font-semibold text-primary/80 uppercase tracking-tighter text-[10px]">Operational Health</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 relative z-10">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[260px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={75}
                            outerRadius={95}
                            paddingAngle={4}
                            strokeWidth={0}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-black tracking-tight"
                                                >
                                                    {isLoading ? "..." : totalWorkspaces.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-80"
                                                >
                                                    Total Workspaces
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pb-6 px-4">
                    {chartData.map((item) => (
                        <div key={item.status} className="flex items-center gap-2 group transition-all">
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125"
                                style={{ backgroundColor: (chartConfig as any)[item.status]?.color }}
                            />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground capitalize leading-none">
                                    {(chartConfig as any)[item.status]?.label}
                                </span>
                                <span className="text-xs font-black text-foreground/90 tabular-nums">
                                    {isLoading ? "..." : item.count}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm pt-4 border-t border-border/10 relative z-10 bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2 leading-none font-bold text-foreground/80">
                    Live Sync <IconTrendingUp className="size-4 text-emerald-500" />
                </div>
                <div className="text-[10px] text-muted-foreground/60 font-medium">
                    Automated report sync
                </div>
            </CardFooter>
        </Card>
    )
}
