"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/assets/image/Logo.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Chat, clearState } from "@/lib/features/data/dataSlice";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Dialog/LogoutDialog";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<Chat[]>([]);
  const [user, setUser] = useState<any>(null);

  const chat = useAppSelector((state) => state.data.chat);
  const userState = useAppSelector((state) => state.auth.user);

  const pathName = usePathname();

  const handleClear = async () => {
    await dispatch(clearState());
    window.location.reload();
  };

  const handleToPlaylist = user ? "/playlist" : "/auth";

  useEffect(() => {
    setInputValue(chat);
  }, [chat]);

  useEffect(() => {
    setUser(userState);
  }, [userState]);

  return (
    <div className="w-full">
      <div className="flex gap-5 justify-between">
        <Link href="/">
          <div className="flex gap-5">
            <Image src={Logo} alt="Moodsyc" />
            <p className="font-stick text-[40px]">MOODSYC</p>
          </div>
        </Link>
        <div>
          {user ? (
            <div className="flex gap-5 items-center">
              <Link href={handleToPlaylist}>
                <Button className="flex gap-5">
                  <Icon icon="iconamoon:profile-fill" />
                  <p className="font-poppins text-lg">{user.display_name}</p>
                </Button>
              </Link>
              <Logout logout={handleClear}>
                <div className="gap-1 rounded-full underline cursor-pointer">
                  Logout
                </div>
              </Logout>
            </div>
          ) : (
            <Button className="gap-1 rounded-full mt-5">
              <Link href="/auth">
                <Icon icon="akar-icons:login" />
                <p className="font-poppins text-lg">Login</p>
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Link href="/playlist">
          <Button className="gap-1 rounded-full mt-5">
            <Icon icon="mingcute:playlist-fill" />
            <p className="font-poppins text-lg">Playlist</p>
          </Button>
        </Link>
        {pathName == "/" &&
          (inputValue.length > 0 ? (
            <Button className="gap-1 rounded-full mt-5" onClick={handleClear}>
              Clear Input
            </Button>
          ) : null)}
      </div>
    </div>
  );
};

export default Navbar;
