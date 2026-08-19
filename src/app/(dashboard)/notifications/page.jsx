import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { NotificationRow } from "@/components/shared/notification-row";

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-mid">Updates on your requests and listings.</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="New activity on your items and requests will show up here."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              id={n.id}
              type={n.type}
              message={n.message}
              isRead={n.isRead}
              createdAt={n.createdAt.toISOString()}
              relatedRequestId={n.relatedRequestId}
              relatedReportId={n.relatedReportId}
            />
          ))}
        </div>
      )}
    </div>
  );
}