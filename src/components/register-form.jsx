import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/auth.context.jsx";
import { Link, useNavigate } from "react-router-dom";

export function RegisterForm() {
  const { signUp, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, name, phone);
      console.log("Registered successfully");
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      console.log("Registered with Google successfully");
      navigate("/");
    } catch (error) {
      console.error("Google registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <Label htmlFor="name" className="sr-only">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="rounded-t-md mb-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="sr-only">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            autoComplete="phone"
            required
            className="mb-2"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email-address" className="sr-only">
            Email address
          </Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mb-2"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="rounded-b-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleRegister}
        >
          Register with Google
        </Button>
      </div>

      <div className="text-sm text-center">
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}
