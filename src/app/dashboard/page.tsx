import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold font-headline mb-4">Welcome to your Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-8">Please select your role-specific dashboard to continue.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/admin">
                <Card className="hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle>Admin</CardTitle>
                        <CardDescription>Manage users and events.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
            <Link href="/dashboard/organizer">
                <Card className="hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle>Organizer</CardTitle>
                        <CardDescription>Create and manage your events.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/dashboard/attendee">
                <Card className="hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle>Attendee</CardTitle>
                        <CardDescription>View your registered events.</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        </div>
    </div>
  );
}
