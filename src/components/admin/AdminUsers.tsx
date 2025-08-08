import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Eye, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
  user_subscriptions?: Array<{
    status: string;
    subscription_plans?: {
      name: string;
    } | null;
  }>;
  delivery_addresses?: Array<{
    street_address: string;
    city: string;
    pincode: string;
    is_default: boolean;
  }>;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error loading users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: { full_name?: string; phone_number?: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "User updated successfully!" });
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error updating user",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.includes(searchTerm) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubscriptionStatus = (user: User) => {
    if (!user.user_subscriptions || user.user_subscriptions.length === 0) {
      return { status: "No Subscription", variant: "secondary" as const };
    }
    
    const activeSubscription = user.user_subscriptions.find(sub => sub.status === 'active');
    if (activeSubscription) {
      return { status: "Active", variant: "default" as const };
    }
    
    const pausedSubscription = user.user_subscriptions.find(sub => sub.status === 'paused');
    if (pausedSubscription) {
      return { status: "Paused", variant: "secondary" as const };
    }
    
    return { status: "Cancelled", variant: "destructive" as const };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const subscriptionStatus = getSubscriptionStatus(user);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{user.phone_number || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={subscriptionStatus.variant}>
                          {subscriptionStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Full Name</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedUser.full_name || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Phone Number</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedUser.phone_number || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Addresses</Label>
                                    {selectedUser.delivery_addresses?.length > 0 ? (
                                      <div className="space-y-2 mt-1">
                                        {selectedUser.delivery_addresses.map((address, index) => (
                                          <div key={index} className="text-sm p-2 bg-muted rounded">
                                            <p>{address.street_address}</p>
                                            <p>{address.city}, {address.pincode}</p>
                                            {address.is_default && (
                                              <Badge variant="secondary" className="mt-1">Default</Badge>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No addresses</p>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <Label>Subscriptions</Label>
                                    {selectedUser.user_subscriptions?.length > 0 ? (
                                      <div className="space-y-2 mt-1">
                                        {selectedUser.user_subscriptions.map((subscription, index) => (
                                          <div key={index} className="text-sm p-2 bg-muted rounded flex justify-between">
                                            <span>{subscription.subscription_plans?.name || 'Unknown Plan'}</span>
                                            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                                              {subscription.status}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No subscriptions</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              {editingUser && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                      id="full_name"
                                      value={editingUser.full_name || ''}
                                      onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        full_name: e.target.value
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                      id="phone_number"
                                      value={editingUser.phone_number || ''}
                                      onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        phone_number: e.target.value
                                      })}
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => updateUser(editingUser.id, {
                                      full_name: editingUser.full_name,
                                      phone_number: editingUser.phone_number
                                    })}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;