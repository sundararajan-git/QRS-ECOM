import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import type { ErrorToastType } from "@/types";
import { showErrorToast } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type OrderType = {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ quantity: number; price: number }>;
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/order");
        if (data.status === "FETCHED") {
          setOrders(data.orders || []);
        }
      } catch (error) {
        showErrorToast(error as ErrorToastType);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setUsername(user?.username || "");
    setProfilePic(user?.profilePic || "");
  }, [user]);

  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await axiosInstance.patch("/user", {
        username,
        profilePic,
      });
      if (data.status === "UPDATED") {
        setUser(data.user);
        toast.success("Profile updated");
      }
    } catch (error) {
      showErrorToast(error as ErrorToastType);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner text="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage account information and view order history.
        </p>
      </div>

      <form
        onSubmit={updateProfile}
        className="space-y-4 rounded-xl border bg-card p-4"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="profilePic">Profile Image URL</Label>
            <Input
              id="profilePic"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Orders</h2>
        {!orders.length ? (
          <div className="rounded-xl border bg-card p-4 text-muted-foreground">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                    {order.status}
                  </span>
                </p>
                <p className="text-sm">Items: {order.items?.length || 0}</p>
                <p className="font-semibold mt-2">
                  Total: {order.totalAmount?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
