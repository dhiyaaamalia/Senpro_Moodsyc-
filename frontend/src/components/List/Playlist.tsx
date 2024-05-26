"use client";
import { fetchSongPlaylist, fetchUserPlaylist } from "@/lib/spotify/spotify";
import { useAppSelector } from "@/lib/store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CreatePlaylistDialog } from "../form/CreatePlaylistForm";

const PlaylistList = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const userState = useAppSelector((state) => state.auth.user);

  const [fetchStatus, setFetchStatus] = useState(false);
  const [playlist, setPlaylist] = useState<any>();
  const [playlistActive, setPlaylistActive] = useState<any>({
    name: "",
    id: "",
  });

  const [playlistContent, setPlaylistContent] = useState<any>([]);

  const fetchPlaylistList = async () => {
    const playlist = await fetchUserPlaylist();
    if (playlist) {
      setPlaylist(playlist.items);
      setPlaylistActive({
        name: playlist.items[0].name,
        id: playlist.items[0].id,
      });
    }
  };

  const fetchPlaylist = async () => {
    const playlist = await fetchSongPlaylist(playlistActive.id);
    if (playlist) {
      let playlistResult = playlist.tracks.items;
      setPlaylistContent(playlistResult);
    }
  };

  const selectPlaylist = (playlist: any) => {
    setPlaylistActive({
      name: playlist.name,
      id: playlist.id,
    });
  };

  const goToPlayback = ({ id }: any) => {
    router.push(`/playback/${id}`);
  };

  useEffect(() => {
    if (userState) {
      setUser(userState);
    } else {
      router.push("/auth");
    }
  }, [userState]);

  useEffect(() => {
    if (!fetchStatus) {
      fetchPlaylistList();
      fetchPlaylist();
      setFetchStatus(true);
    }
  }, []);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistActive]);

  return (
    <>
      <div className="w-full flex gap-5 mt-5 items-start">
        <div className="w-[20%]  ">
          <div className="invisible p-2 flex w-full px-5 gap-3 mb-3">
            <Icon
              className="bg-primary text-white rounded-lg w-[30px] h-[30px]"
              icon="mingcute:playlist-fill"
            />
            <p className="font-poppins text-lg">{playlistActive.name}</p>
          </div>
          <div className="border-[1px] border-primary rounded-xl min-h-[50vh] py-5 flex flex-col justify-between">
            <div>
              {playlist?.map(
                (item: any) =>
                  item.owner.display_name === user.display_name && (
                    <div
                      key={item.id}
                      className="p-2 flex w-full px-5 gap-3 mb-5 cursor-pointer"
                      onClick={() => {
                        selectPlaylist(item);
                      }}
                    >
                      <Icon
                        className="bg-primary text-white rounded-lg w-[30px] h-[30px]"
                        icon="mingcute:playlist-fill"
                      />
                      <p
                        className={`font-poppins text-lg ${
                          playlistActive.name == item.name ? "underline" : ""
                        }
                hover:underline
                `}
                      >
                        {item.name}
                      </p>
                    </div>
                  )
              )}
            </div>
            <div className="w-full items-center flex justify-center">
              <CreatePlaylistDialog />
            </div>
          </div>
        </div>
        <div className="w-[80%]">
          <div className="p-2 flex w-full px-5 gap-3 mb-3">
            <Icon
              className="bg-primary text-white rounded-lg w-[30px] h-[30px]"
              icon="mingcute:playlist-fill"
            />
            <p className="font-poppins text-lg">{playlistActive.name}</p>
          </div>
          <div className=" border-[1px] border-primary rounded-xl h-screen p-5">
            {playlistContent ? (
              playlistContent.map((item: any) => (
                <div
                  key={item.track.id}
                  onClick={() => {
                    goToPlayback(item.track);
                  }}
                  className="w-full flex flex-col hover:bg-gray-100 p-2 rounded-lg gap-2 cursor-pointer
                "
                >
                  <p className="text-xl font-bold">
                    {item.track.name}{" "}
                    <span className="text-sm font-normal">
                      by {item.track.artists[0].name}
                    </span>
                  </p>
                  <div className="mt-2 mb-5 w-full h-[1px] bg-gray-500 rounded-full"></div>
                </div>
              ))
            ) : (
              <p>Tidak ada musik</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistList;
