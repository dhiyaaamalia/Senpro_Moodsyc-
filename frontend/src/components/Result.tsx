"use client";
import { Chat } from "@/lib/features/data/dataSlice";
import { useAppSelector } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { LegacyRef, use, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { AddToPlaylistDialog } from "./List/PlaylistDialog";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Result = () => {
  const [chatValue, setChatValue] = useState<Chat[]>([]);
  const [loadingValue, setLoadingValue] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const chat = useAppSelector((state) => state.data.chat);
  const loading = useAppSelector((state) => state.data.loading);
  const user = useAppSelector((state) => state.auth.user);
  const chatEndRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatValue]);

  useEffect(() => {
    setChatValue(chat);
  }, [chat]);

  useEffect(() => {
    setLoadingValue(loading);
  }, [loading]);

  const goToPlayback = ({ id }: any) => {
    if (user) {
      router.push(`/playback/${id}`);
    } else {
      setIsLogin(false);
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    }
  };

  return (
    <div className="chat grow w-full flex flex-col mt-5 overflow-y-scroll px-5">
      {chatValue.map((chat, index) => {
        return chat.type === "input" ? (
          <div
            key={`input-${index}`}
            className="flex justify-end items-center w-full mb-5"
          >
            <h1 className="text-xl bg-blue-200 rounded-3xl text-right px-5 py-2 max-w-lg">
              {chat.content[0].name}
            </h1>
          </div>
        ) : (
          <div
            key={`result-${index}`}
            className="flex justify-start items-center w-full mb-5"
          >
            {typeof chat.content === "string" ? (
              <h1 className="text-xl bg-gray-200 rounded-3xl text-left px-5 py-2 max-w-md">
                {chat.content}
              </h1>
            ) : (
              <div className="text-xl bg-gray-200 rounded-3xl text-left px-5 py-2 max-w-lg">
                <h1 className="mb-5">
                  Mungkin ini lagu yang cocok untuk kamu dengarkan.
                </h1>
                <div className="flex flex-col gap-2 w-full">
                  {chat.content.map((content, index) => {
                    return (
                      <div
                        key={`content-${index} `}
                        className="flex flex-row w-full items-center gap-5 bg-white p-2 rounded-lg shadow-md mb-2"
                      >
                        <img
                          src={content.image}
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-auto">
                          <h1
                            onClick={() => goToPlayback({ id: content.id })}
                            className="text-lg
                            underline cursor-pointer
                          "
                          >
                            {content.name}
                          </h1>
                          <h1 className="text-xs">by {content.artist}</h1>
                        </div>
                        <div>
                          {user === null ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button disabled className="cursor-default">
                                    <Icon
                                      className="bg-primary text-white rounded-lg w-[20px] h-[20px] cursor-default"
                                      icon="carbon:add-filled"
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Login to add to playlist</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <AddToPlaylistDialog song={content} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {loadingValue && (
        <div className="flex justify-start items-center w-full">
          <h1 className="text-xl bg-gray-200 rounded-3xl text-left px-5 py-2 max-w-md mb-5">
            Loading...
          </h1>
        </div>
      )}

      {!isLogin && (
        <Alert
          className="absolute top-0 left-1/2 transform -translate-x-1/2 m-5 bg-red-100 w-80 rounded-lg shadow-md
      "
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            You need to login first to access this feature
          </AlertDescription>
        </Alert>
      )}
      <div ref={chatEndRef as LegacyRef<HTMLDivElement>} />
    </div>
  );
};

export default Result;
