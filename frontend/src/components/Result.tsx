"use client";
import { useAppSelector } from "@/lib/store";
import React, { useEffect, useState } from "react";

const Result = () => {
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const input = useAppSelector((state) => state.data.input);
  const result = useAppSelector((state) => state.data.result);

  useEffect(() => {
    setInputValue(input);
    setResultValue(result);
  }, [input, result]);

  return (
    <div className="grow w-full flex gap-5 flex-col mt-5">
      {inputValue && (
        <div className="flex justify-end items-center w-full ">
          <h1 className="text-xl  bg-gray-200 rounded-3xl text-right px-5 py-2">
            {inputValue}
          </h1>
        </div>
      )}
      {resultValue && (
        <div className="flex justify-start items-center w-full ">
          <h1 className="text-xl  bg-gray-200 rounded-3xl text-left px-5 py-2">
            {resultValue}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Result;
