// components/dashboard/DashboardCharts.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardCharts({ data }: { data: any[] }) {
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    Penerimaan: Number(item.count),
  }));

  if (formattedData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground italic bg-white/5 dark:bg-black/5 rounded-2xl border border-dashed border-white/20">
        Belum ada data statistik tersedia
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-800 opacity-50" />
          <XAxis 
            dataKey="date" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'currentColor', opacity: 0.7 }}
            dy={10}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
            tick={{ fill: 'currentColor', opacity: 0.7 }}
          />
          <Tooltip 
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.2)', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              color: '#1e1b4b',
              fontWeight: 'bold'
            }}
            itemStyle={{ color: '#4f46e5' }}
          />
          <Area 
            type="monotone" 
            dataKey="Penerimaan" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
