"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/store";
import { setInput, setResult } from "@/lib/features/data/dataSlice";

const TextInputForm = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setInput(inputValue));
    dispatch(setResult("Your music suits your mood!"));
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          defaultValue=""
          className="h-[50px] rounded-3xl px-5 placeholder-gray-500 placeholder:italic "
          placeholder="Find Your music suits your mood!"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
        />
      </form>
    </div>
  );
};

export default TextInputForm;
