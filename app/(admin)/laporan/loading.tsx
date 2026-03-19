import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LaporanLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-gray-950 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-xl">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </CardHeader>
            <CardContent className="p-5">
              <Skeleton className="h-8 w-24 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-[2.5rem] bg-white dark:bg-gray-950 p-6 overflow-hidden">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
