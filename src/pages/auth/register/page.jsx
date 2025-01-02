import { AuthLayout } from "../../../components/auth-layout.jsx";
import { RegisterForm } from "../../../components/register-form.jsx";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your SnackSpot account">
      <RegisterForm />
    </AuthLayout>
  );
}
