
import {
    Activity,
    Users,
    CalendarCheck,
    AlertCircle,
  } from 'lucide-react'
  
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import { analyticsData, getEvents, getUsers } from '@/lib/data';
  import { AnalyticsCharts } from '@/components/dashboard/admin/analytics-charts';
  import { UserManagement } from '@/components/dashboard/admin/user-management';
  import EventApprovalForm from '@/components/dashboard/admin/event-approval-form';
  
  export default async function AdminDashboardPage() {
    const users = await getUsers();
    const events = await getEvents();
    const pendingApprovals = events.filter(e => e.status === 'Pending').length;
    const activeEvents = events.filter(e => e.status === 'Approved').length;

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users.length.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Events
                    </CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">
                    +15 since last month
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{activeEvents}</div>
                    <p className="text-xs text-muted-foreground">
                    Currently running
                    </p>
                </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">+{pendingApprovals}</div>
                    <p className="text-xs text-muted-foreground">
                    Require manual review
                    </p>
                </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Monthly new user signups.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AnalyticsCharts />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Event Approval Tool</CardTitle>
                        <CardDescription>
                            Use our AI to check if an event meets community guidelines.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EventApprovalForm />
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8">
                 <UserManagement users={users} />
            </div>
      </>
    )
  }
