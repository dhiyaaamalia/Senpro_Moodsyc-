"use client";
import {
  fetchSongPlaylist,
  fetchUserPlaylist,
  removeSongFromPlaylist,
} from "@/lib/spotify/spotify";
import { useAppSelector } from "@/lib/store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CreatePlaylistDialog } from "../form/CreatePlaylistForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import RemoveDialog from "../Dialog/RemoveDialog";
import { toast } from "../ui/use-toast";

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
      for (let i = 0; i < playlist.items.length; i++) {
        if (
          userState &&
          (userState as { display_name: string }).display_name ===
            playlist.items[i].owner.display_name
        ) {
          setPlaylistActive({
            name: playlist.items[i].name,
            id: playlist.items[i].id,
          });
          break;
        }
      }
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

  const removeSong = async (trackUri: string) => {
    let res = await removeSongFromPlaylist(playlistActive.id, trackUri);

    toast({
      title: "Song removed from playlist",
      description: `Your song has been removed from the playlist.`,
    });
    fetchPlaylist();
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
              <CreatePlaylistDialog setFetchStatus={setFetchStatus} />
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
              playlistContent.map((item: any, index: any) => (
                <div
                  key={`content-${index} `}
                  className="flex flex-row w-full items-center gap-5 bg-white p-2 rounded-lg shadow-md mb-2"
                >
                  <img
                    src={item.track.album.images[0].url}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-auto">
                    <h1
                      onClick={() => goToPlayback({ id: item.track.id })}
                      className="text-lg
                            underline cursor-pointer
                          "
                    >
                      {item.track.name}
                    </h1>
                    <h1 className="text-xs">by {item.track.artists[0].name}</h1>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <RemoveDialog
                          playlist={playlistActive.name}
                          title={item.track.name}
                          submit={() => removeSong(item.track.uri)}
                        >
                          <div
                            className="bg-primary text-white rounded-lg w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                            onClick={(e) => {}}
                          >
                            <Icon icon="gg:remove" />
                          </div>
                        </RemoveDialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove from playlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
