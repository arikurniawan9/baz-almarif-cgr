"use client";

import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardLeaderboard({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Belum ada data wilayah
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {data.map((item, index) => (
        <motion.div 
          key={item.wilayahName}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full font-black text-sm shrink-0 shadow-inner bg-white dark:bg-black text-indigo-500">
            {index === 0 ? <Trophy className="h-4 w-4 text-amber-500" /> : `#${index + 1}`}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{item.wilayahName}</h4>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min((item.count / data[0].count) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-black text-indigo-600 dark:text-indigo-400">{item.count}</span>
            <span className="text-[10px] text-slate-500 block">Transaksi</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
