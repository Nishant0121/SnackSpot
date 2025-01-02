import { AuthLayout } from "../../../components/auth-layout";
import { LoginForm } from "../../../components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout title="Sign in to SnackSpot">
      <LoginForm />
    </AuthLayout>
  );
}
