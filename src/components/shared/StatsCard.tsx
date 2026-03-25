import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsCardProps {
    title : string;
    value : string | number;
    iconName : string;
    description ?: string
    className ?: string;
    gradient ?: string;
}

const StatsCard = ({title, value, iconName, description, className, gradient = "from-indigo-500 to-violet-500"}: StatsCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden rounded-2xl border-border/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300",
      className
    )}>
      {/* Gradient accent strip */}
      <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", gradient)} />

      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110",
          gradient,
          gradient === "from-indigo-500 to-violet-500" && "shadow-indigo-500/25",
          gradient === "from-emerald-500 to-teal-500" && "shadow-emerald-500/25",
          gradient === "from-amber-500 to-orange-500" && "shadow-amber-500/25",
          gradient === "from-rose-500 to-pink-500" && "shadow-rose-500/25",
          gradient === "from-cyan-500 to-blue-500" && "shadow-cyan-500/25",
          gradient === "from-violet-500 to-purple-500" && "shadow-violet-500/25",
        )}>
          {createElement(getIconComponent(iconName), { className: "w-5 h-5 text-white" })}
        </div>
      </CardHeader>

      <CardContent className="space-y-1 pb-5">
        <div className="text-3xl font-bold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {
            description && (
                <p className="text-xs font-medium text-muted-foreground">
                    {description}
                </p>
            )
        }
      </CardContent>
    </Card>
  );
}

export default StatsCard