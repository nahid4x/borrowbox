import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
export default async function DashboardLayout({ children, }) {
    // Middleware already guarantees a session exists for every route under
    // this layout, so we can read it here without a redundant redirect check.
    const session = await auth();
    const user = session.user;
    const [unreadCount, dbUser] = await Promise.all([
        prisma.notification.count({
            where: { userId: user.id, isRead: false },
        }),
        prisma.user.findUnique({
            where: { id: user.id },
            select: { avatarUrl: true },
        }),
    ]);
    return (<div className="flex min-h-screen">
      <Sidebar isAdmin={user.role === "ADMIN"}/>
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar userName={user.name ?? "Student"} userRole={user.role} unreadCount={unreadCount} avatarUrl={dbUser?.avatarUrl}/>
        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>);
}
