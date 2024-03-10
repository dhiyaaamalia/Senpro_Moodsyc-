"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

function AuthForm() {
  return (
    <div className="relative w-full lg:w-[40%] px-5 lg:px-0 h-screen flex items-center justify-center top-[-150px] lg:top-0">
      <Tabs defaultValue="signin" className="w-[400px] shadow-lg">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="signin"
            className="data-[state=active]:bg-white rounded-lg"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-white rounded-lg"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Email</Label>
                <Input id="name" defaultValue="" placeholder="mood@syc.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  id="username"
                  type="password"
                  defaultValue=""
                  placeholder="*******"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Button className="w-1/3">Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">
                Sign up for a new account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input id="current" type="email" placeholder="mood@syc.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input id="new" type="password" placeholder="*******" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Retype Password</Label>
                <Input id="new" type="password" placeholder="*******" />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Button className="w-1/2">Create Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AuthForm;
