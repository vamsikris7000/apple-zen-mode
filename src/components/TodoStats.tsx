import { useTodo } from "@/contexts/TodoContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Target,
  Calendar
} from "lucide-react";

export const TodoStats = () => {
  const { stats } = useTodo();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    }
  ];

  return (
    <>
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              {stat.title === "Completed" && stats.total > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.completed / stats.total) * 100)}% complete
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
