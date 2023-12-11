import { ActivityItem } from "@/components/activity-item"
import { Skeleton } from "@/components/ui/skeleton"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { AuditLog } from "@prisma/client"
import { redirect } from "next/navigation"

export const ActivityList = async () => {
  const { orgId } = auth()

  if (!orgId) {
    redirect("/select-org")
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block font-semibold text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {auditLogs.map((log: AuditLog) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  )
}

ActivityList.Skeleton = function ActivitySkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[40%] h-12" />
      <Skeleton className="w-[50%] h-12" />
      <Skeleton className="w-[30%] h-12" />
      <Skeleton className="w-[50%] h-12" />
      <Skeleton className="w-[60%] h-12" />
    </ol>
  )
}
