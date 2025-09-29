
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
  import { getEvents, getUsers, analyticsData } from '@/lib/data';
  import { AnalyticsCharts } from '@/components/dashboard/admin/analytics-charts';
  import { UserManagement } from '@/components/dashboard/admin/user-management';
  import EventApprovals from '@/components/dashboard/admin/event-approvals';
  
  export default async function AdminDashboardPage() {
    const users = await getUsers();
    const events = await getEvents();
    const pendingEvents = events.filter(e => e.status === 'Pending');
    const activeEvents = events.filter(e => e.status === 'Approved').length;

    const userSignups = users.reduce((acc, user) => {
        const month = new Date(user.lastLogin).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        if (existingMonth) {
            existingMonth.signups++;
        } else {
            acc.push({ month, signups: 1 });
        }
        return acc;
    }, [] as { month: string, signups: number }[]);


    return (
        <div className="flex flex-col gap-4">
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
                    <div className="text-2xl font-bold text-destructive">+{pendingEvents.length}</div>
                    <p className="text-xs text-muted-foreground">
                    Require manual review
                    </p>
                </CardContent>
                </Card>
            </div>
            <div id="analytics" className="grid gap-4 md:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Monthly new user signups.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AnalyticsCharts data={userSignups} />
                    </CardContent>
                </Card>
            </div>
            <div id="event-approvals" className="grid gap-4 md:gap-8">
                <EventApprovals events={pendingEvents} />
            </div>
            <div id="user-management" className="grid gap-4 md:gap-8">
                 <UserManagement users={users} />
            </div>
      </div>
    )
  }
