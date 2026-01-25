import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-border/50 bg-card p-6',
      'hover:border-primary/30 transition-colors duration-300',
      className
    )}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% este mês
            </p>
          )}
        </div>
        
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
