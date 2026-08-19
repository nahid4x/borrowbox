import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordForm } from "@/components/profile/password-form";
import { GlassCard } from "@/components/ui/glass-card";
export default async function ProfilePage() {
    const session = await auth();
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true, studentId: true },
    });
    return (<div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-mid">Manage your account details.</p>
      </div>

      <GlassCard className="p-6">
        <p className="text-sm text-low">
          Member since {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <ProfileForm userId={user.id} name={user.name} email={user.email} avatarUrl={user.avatarUrl} studentId={user.studentId}/>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <PasswordForm userId={user.id}/>
      </GlassCard>
    </div>);
}
