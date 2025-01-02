import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setOrders(orderList);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const orderRef = ref(db, `orders/${orderId}`);
    update(orderRef, { status: newStatus });
  };

  const deleteOrder = (orderId) => {
    const orderRef = ref(db, `orders/${orderId}`);
    remove(orderRef);
  };

  // Table view for larger screens
  const TableView = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Order ID</th>
            <th className="p-4 text-left">Dish Name</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Customizations</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-4">#{order.id}</td>
              <td className="p-4">{order.name}</td>
              <td className="p-4">{order.quantity}</td>
              <td className="p-4">₹{order.totalPrice}</td>
              <td className="p-4">{order.status}</td>
              <td className="p-4">
                {order.customizations ? (
                  <ul className="list-disc list-inside">
                    {order.customizations.map((custom, index) => (
                      <li key={index}>{custom}</li>
                    ))}
                  </ul>
                ) : (
                  "No customizations"
                )}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    disabled={
                      order.status === "preparing" ||
                      order.status === "prepared"
                    }
                    size="sm"
                  >
                    Preparing
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order.id, "prepared")}
                    disabled={order.status === "prepared"}
                    size="sm"
                  >
                    Prepared
                  </Button>
                  {order.status === "prepared" && (
                    <Button
                      onClick={() => deleteOrder(order.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Card view for mobile screens
  const CardView = () => (
    <div className="grid gap-4 md:hidden">
      {orders.map((order) => (
        <Card key={order.id} className="w-full">
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Customer ID:</strong> {order.userId}
            </p>
            <p>
              <strong>Dish:</strong> {order.name}
            </p>
            <p>
              <strong>Quantity:</strong> {order.quantity}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Order Time:</strong>{" "}
              {new Date(order.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Payment Type:</strong> {order.type}
            </p>
            {order.customizations && (
              <div>
                <strong>Customizations:</strong>
                <ul className="list-disc list-inside">
                  {order.customizations.map((custom, index) => (
                    <li key={index}>{custom}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <Button
              onClick={() => updateOrderStatus(order.id, "preparing")}
              disabled={
                order.status === "preparing" || order.status === "prepared"
              }
              className="w-full sm:w-auto"
            >
              Preparing
            </Button>
            <Button
              onClick={() => updateOrderStatus(order.id, "prepared")}
              disabled={order.status === "prepared"}
              className="w-full sm:w-auto"
            >
              Prepared
            </Button>
            {order.status === "prepared" && (
              <Button
                onClick={() => deleteOrder(order.id)}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Complete Order
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <TableView />
      <CardView />
    </div>
  );
}
