import { BarChartData } from "@/types/dashboard.types"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"



interface AppointmentBarChartProps {
    data : BarChartData[]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border/50 bg-background/95 glass-effect px-4 py-3 shadow-xl">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground">
                    Appointments: <span className="font-semibold text-foreground">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const AppointmentBarChart = ({data}: AppointmentBarChartProps) => {

    if(!data || !Array.isArray(data)){
        return (
            <Card className="rounded-2xl border-border/50">
                <CardHeader>
                    <CardTitle>Appointment Trends</CardTitle>
                    <CardDescription>Monthly appointment statistics</CardDescription>
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
        month : typeof item.month === "string" ? format(new Date(item.month), "MMM yyyy") : format(item.month, "MMM yyyy"),

        appointments : Number(item.count)
    }))


    if(!formattedData.length || formattedData.every(item => item.appointments === 0)){
        return (
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Monthly appointment statistics</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-75">
              <p className="text-sm text-muted-foreground">
                No appointment data available.
              </p>
            </CardContent>
          </Card>
        );
    }
  return (
    <Card className="rounded-2xl border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">Appointment Trends</CardTitle>
            <CardDescription>Monthly appointment statistics overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={formattedData} barGap={4}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={1} />
                  <stop offset="100%" stopColor="oklch(0.6 0.25 300)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 264)" vertical={false} />
              <XAxis
                tickLine={false}
                axisLine={false}
                dataKey="month"
                tick={{ fontSize: 12, fill: "oklch(0.5 0.03 264)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "oklch(0.5 0.03 264)" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.95 0.02 264)", radius: 8 }} />
              <Bar
                dataKey="appointments"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}

export default AppointmentBarChart