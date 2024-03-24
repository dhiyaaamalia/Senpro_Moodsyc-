"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/assets/image/Logo.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { clearState } from "@/lib/features/data/dataSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const input = useAppSelector((state) => state.data.input);

  const handleClear = () => {
    dispatch(clearState());
  };

  useEffect(() => {
    setInputValue(input);
  }, [input]);

  return (
    <div className="w-full">
      <div className="flex gap-5">
        <Image src={Logo} alt="Moodsyc" />
        <p className="font-stick text-[40px]">MOODSYC</p>
      </div>
      <div className="flex justify-between">
        <Button className="gap-1 rounded-full mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
              <path
                fill="currentColor"
                d="m17.33 4.055l2.986.996a1 1 0 0 1-.632 1.898L18 6.387V17.5a3.5 3.5 0 1 1-2-3.163V5.014c0-.69.675-1.177 1.33-.959M8 17a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2zm2-6a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2zm3-6a1 1 0 0 1 .117 1.993L13 7H4a1 1 0 0 1-.117-1.993L4 5z"
              ></path>
            </g>
          </svg>
          <p className="font-poppins text-lg">Playlist</p>
        </Button>
        {input && (
          <Button className="gap-1 rounded-full mt-5" onClick={handleClear}>
            <p>Clear Input</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
