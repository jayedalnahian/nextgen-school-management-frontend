import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PieChartData } from "@/types/dashboard.types";


interface AppointmentPieChartProps {
    data : PieChartData[]
    title ?: string
    description ?: string
}

const CHART_COLORS = [
  "oklch(0.488 0.243 264.376)", // indigo
  "oklch(0.696 0.17 162.48)",   // emerald
  "oklch(0.769 0.188 70.08)",   // amber
  "oklch(0.645 0.246 16.439)",  // rose
  "oklch(0.6 0.2 200)",         // cyan
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border/50 bg-background/95 glass-effect px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: payload[0].payload.fill }}
                    />
                    <p className="text-sm font-semibold">{payload[0].name}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Count: <span className="font-semibold text-foreground">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};


const AppointmentPieChart = ({data, title = "Status Distribution", description = "Breakdown by appointment status"}: AppointmentPieChartProps) => {

    if(!data || !Array.isArray(data)){
        return (
            <Card className="rounded-2xl border-border/50">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-75">
                    <p className="text-sm text-muted-foreground">
                        Invalid data provided for the chart.
                    </p>
                </CardContent>
            </Card>
        )
    }


    const formattedData = data.map((item) => ({
      name: item.status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: Number(item.count),
    }));


    if(!formattedData.length || formattedData.every(item => item.value === 0)){
        return (
            <Card className="rounded-2xl border-border/50">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="flex items-center justify-center h-75">
                    <p className="text-sm text-muted-foreground">
                        No data available to display.
                    </p>
                </CardContent>
            </Card>
        )
    }
  return (
    <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        dataKey={"value"}
                        strokeWidth={3}
                        stroke="oklch(1 0 0)"
                    >
                        {formattedData.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span className="text-sm text-muted-foreground">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}

export default AppointmentPieChart