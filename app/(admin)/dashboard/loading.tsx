import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass border-white/40 shadow-xl shadow-indigo-100/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-32 rounded-xl mb-3" />
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass col-span-1 md:col-span-2 lg:col-span-3 border-white/40 shadow-xl shadow-indigo-100/10">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800/50">
            <Skeleton className="h-6 w-48 rounded-lg" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </CardContent>
        </Card>

        <Card className="glass col-span-1 md:col-span-2 lg:col-span-1 border-white/40 shadow-xl shadow-indigo-100/10">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800/50">
            <Skeleton className="h-6 w-36 rounded-lg" />
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
