import AuthForm from "@/components/form/AuthForm";
import { Metadata } from "next";
import Image from "next/image";
import Login from "@/assets/image/login.png";

export const metadata: Metadata = {
  title: "Auth",
  description: "Authentication page for users to sign in or sign up.",
};

function AuthPage() {
  return (
    <div className="w-full flex lg:flex-row flex-col h-screen">
      <div className="w-full lg:w-[60%] bg-white h-full lg:h-screen flex items-center justify-center">
        <div className="relative w-[80%] h-[80%] max-w-md">
          <Image
            src={Login}
            alt="Authentication"
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </div>
      </div>
      <AuthForm />
    </div>
  );
}

export default AuthPage;
