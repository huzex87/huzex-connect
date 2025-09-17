import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: string;
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  gradient = "from-primary/10 via-primary/5 to-transparent",
  trend,
  progress
}) => {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-0 hover:shadow-lg transition-all duration-300 group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-3xl font-bold ${iconColor.replace('text-', 'text-')} group-hover:scale-105 transition-transform`}>
              {value}
            </p>
            {subtitle && (
              <div className="flex items-center text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
            {trend && (
              <div className="flex items-center text-xs text-muted-foreground">
                {trend}
              </div>
            )}
            {progress !== undefined && (
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div 
                  className={`h-1 rounded-full ${iconColor.replace('text-', 'bg-')} transition-all duration-500`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}
          </div>
          <div className={`${iconColor} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
            <Icon className="h-10 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};