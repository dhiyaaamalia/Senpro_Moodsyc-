"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/store";
import { addInput, addResult, setLoading } from "@/lib/features/data/dataSlice";
import axios from "axios";

const TextInputForm = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (inputValue.length !== 0) {
      e.preventDefault();
      dispatch(addInput(inputValue));
      setInputValue("");
      dispatch(setLoading(true));
      axios
        .post("http://127.0.0.1:5000/search", { query: inputValue })
        .then((response) => {
          let data = response.data;
          console.log(data);
          let countSong = data.song.length;
          if (countSong == 0) {
            dispatch(addResult(data.message));
          } else {
            let resultData = [];
            for (let i = 0; i < countSong; i++) {
              if (data.song[i] != null) {
                let dataSong = {
                  name: data.song[i].name,
                  id: data.song[i].id,
                  image: data.song[i].album.images[0].url,
                  artist: data.song[i].artists[0].name,
                  message: "",
                  trackUri: data.song[i].uri,
                };
                resultData.push(dataSong);
              }
            }
            dispatch(addResult(resultData));
          }
          dispatch(setLoading(false));
        })
        .catch((error) => {
          console.log(error);
          dispatch(setLoading(false));
        });
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          value={inputValue}
          className="h-[50px] rounded-3xl px-5 placeholder-gray-500 placeholder:italic bg-[#F5F5F5]"
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
