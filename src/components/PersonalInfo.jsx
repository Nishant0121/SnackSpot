import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/auth.context.jsx";

export default function PersonalInfo() {
  const { currentUser, logOut } = useAuth();
  const [name, setName] = useState(currentUser?.name);
  const [phone, setPhone] = useState(currentUser?.phone);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logOut();
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <div className="flex items-center mb-4">
        <Avatar className="h-24 w-24 mr-4">
          <img src={currentUser?.prfile_pic} alt="Profile picture" />
        </Avatar>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={currentUser?.email} disabled />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone ? phone : ""}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        {isEditing ? (
          <Button onClick={handleSave}>Save Changes</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
      <div className="mt-6">
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
