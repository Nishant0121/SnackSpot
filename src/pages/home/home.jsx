import { Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../context/auth.context.jsx";
import { db } from "../../firebase.jsx";
import { doc, setDoc } from "firebase/firestore";

export default function HomePage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const requestPermission = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is required for notifitions");
      }

      console.log("Requesting permission for user:", userId);
      const fcmToken = await requestNotificationPermission();

      if (!fcmToken) {
        throw new Error("Failed to get FCM token");
      }

      console.log("FCM Token received:", fcmToken);

      const tokenRef = doc(db, "userTokens", userId);
      await setDoc(
        tokenRef,
        {
          fcmToken: fcmToken,
          updatedAt: new Date().toISOString(),
          userId: userId,
        },
        { merge: true }
      );

      console.log("Token stored in Firestore successfully");
      return fcmToken;
    } catch (error) {
      console.error("Notification permission error:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Menu Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Grilled Chicken Salad</span>
                  <Badge>New</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Vegetarian Pasta</span>
                  <Badge variant="secondary">Popular</Badge>
                </li>
                <li>Tomato Soup</li>
                <li>Fish and Chips</li>
              </ul>
            </CardContent>
          </Card>

          {/* Current Offers */}
          <Card>
            <CardHeader>
              <CardTitle>Special Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Badge variant="destructive">20% OFF</Badge>
                  <span>on all salads today!</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Badge variant="destructive">FREE</Badge>
                  <span>dessert with any main course</span>
                </li>
                <li>Happy Hour: 50% off drinks from 4-6 PM</li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Order */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={requestPermission}>
                Dine In
              </Button>
              <Button className="w-full" variant="outline">
                Takeaway
              </Button>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {currentUser?.points}
                </p>
                <p className="text-sm text-gray-500">points</p>
              </div>
              <p className="mt-4 text-sm text-center">
                You're 50 points away from a free meal!
              </p>
            </CardContent>
          </Card>

          {/* Nearby Canteens */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Nearby Canteens</CardTitle>
              <CardDescription>Within 100-meter radius</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Main Building Cafeteria</p>
                    <p className="text-sm text-gray-500">Open now • 50m away</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Science Block Canteen</p>
                    <p className="text-sm text-gray-500">
                      Opens at 11:00 AM • 80m away
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
