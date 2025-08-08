import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, CreditCard, Package, TrendingUp, UserPlus, FileDown, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface OverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  monthlyRevenue: number;
  newSignupsThisWeek: number;
  totalProducts: number;
  todayDeliveries: number;
  todayCancellations: number;
  pendingPayments: number;
  csvExportsToday: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    pausedSubscriptions: 0,
    monthlyRevenue: 0,
    newSignupsThisWeek: 0,
    totalProducts: 0,
    todayDeliveries: 0,
    todayCancellations: 0,
    pendingPayments: 0,
    csvExportsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const [usersResponse, subscriptionsResponse, paymentsResponse, productsResponse] = await Promise.all([
        // Total users
        supabase.from('profiles').select('id', { count: 'exact' }),
        
        // Subscriptions
        supabase.from('user_subscriptions').select('status', { count: 'exact' }),
        
        // Monthly revenue
        supabase
          .from('payment_history')
          .select('amount')
          .eq('payment_status', 'completed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // Total products
        supabase.from('products').select('id', { count: 'exact' })
      ]);

      // Calculate new signups this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const newSignupsResponse = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', weekAgo.toISOString());

      // Get subscription statuses
      const subscriptionsData = await supabase
        .from('user_subscriptions')
        .select('status');

      const activeCount = subscriptionsData.data?.filter(sub => sub.status === 'active').length || 0;
      const pausedCount = subscriptionsData.data?.filter(sub => sub.status === 'paused').length || 0;

      // Calculate monthly revenue
      const monthlyRevenue = paymentsResponse.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Today's deliveries and cancellations
      const { data: todayDeliveries } = await supabase
        .from('meal_deliveries')
        .select('id', { count: 'exact' })
        .eq('delivery_date', today)
        .eq('status', 'scheduled');

      const { data: todayCancellations } = await supabase
        .from('meal_deliveries')
        .select('id', { count: 'exact' })
        .eq('delivery_date', today)
        .eq('status', 'cancelled');

      // Pending payments
      const { data: pendingPayments } = await supabase
        .from('payment_history')
        .select('id', { count: 'exact' })
        .eq('payment_status', 'pending');

      setStats({
        totalUsers: usersResponse.count || 0,
        activeSubscriptions: activeCount,
        pausedSubscriptions: pausedCount,
        monthlyRevenue,
        newSignupsThisWeek: newSignupsResponse.count || 0,
        totalProducts: productsResponse.count || 0,
        todayDeliveries: todayDeliveries?.length || 0,
        todayCancellations: todayCancellations?.length || 0,
        pendingPayments: pendingPayments?.length || 0,
        csvExportsToday: 0, // This would come from export history table
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered customers"
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: Calendar,
      description: "Currently active plans"
    },
    {
      title: "Paused Subscriptions",
      value: stats.pausedSubscriptions,
      icon: Calendar,
      description: "Temporarily paused"
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: CreditCard,
      description: "This month's earnings"
    },
    {
      title: "New Signups",
      value: stats.newSignupsThisWeek,
      icon: UserPlus,
      description: "This week"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Available items"
    },
  ];

  const dailySummaryCards = [
    {
      title: "Today's Active Deliveries",
      value: stats.todayDeliveries,
      icon: Package,
      description: "Scheduled for today",
      variant: "default" as const
    },
    {
      title: "Today's Cancellations",
      value: stats.todayCancellations,
      icon: AlertTriangle,
      description: "Cancelled today",
      variant: "destructive" as const
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: CreditCard,
      description: "Awaiting payment",
      variant: "secondary" as const
    },
    {
      title: "CSV Exported Orders",
      value: stats.csvExportsToday,
      icon: FileDown,
      description: "Today's exports",
      variant: "outline" as const
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-12 animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Key metrics for your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dailySummaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;