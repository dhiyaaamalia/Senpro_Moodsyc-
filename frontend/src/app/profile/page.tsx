"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const userState = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (userState) {
      setUser(userState);
    } else {
      router.push("/auth");
    }
  }, [userState]);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <div className="flex flex-col gap-3">
        <Link
          href={user ? "/" : "/auth"}
          className="gap-1 rounded-full mt-5 flex items-center"
        >
          <Icon icon="ion:arrow-back" />
          <p className="font-poppins text-lg">Dashboard</p>
        </Link>
        <div className="border-[1px] border-primary shadow-xl w-[80vw] lg:w-[30vw] rounded-xl flex flex-col p-5">
          <h1 className="font-bold font-stick text-2xl text-center mb-5">
            Profile
          </h1>
          {user ? (
            <>
              <div className="w-full flex flex-col justify-center items-center gap-2">
                {user.images.length > 0 ? (
                  <img
                    src={user.images[0].url}
                    alt="profile"
                    className="rounded-full w-20 h-20"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="profile"
                    className="rounded-full w-20 h-20"
                  />
                )}
                <p>{user.display_name}</p>
                <p>{user.email}</p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
