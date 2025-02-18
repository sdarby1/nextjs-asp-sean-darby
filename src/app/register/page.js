import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="layout-container">
      <div className="sign-in-container">
        <h1 className="form-headline">Sign Up</h1>
        <RegisterForm />
      </div>
    </div>
  );
}