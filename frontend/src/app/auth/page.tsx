import AuthForm from "@/components/form/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Page",
  description: "Authentication page for users to sign in or sign up.",
};

function AuthPage() {
  return (
    <div className="w-full flex lg:flex-row flex-col h-screen">
      <div className="w-full lg:w-[60%] bg-primary h-full lg:h-screen"></div>
      <AuthForm />
    </div>
  );
}

export default AuthPage;
