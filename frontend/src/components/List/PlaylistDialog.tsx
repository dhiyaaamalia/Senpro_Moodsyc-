"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { addSongToPlaylist, fetchUserPlaylist } from "@/lib/spotify/spotify";
import { toast } from "../ui/use-toast";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";
import { CreatePlaylistDialog } from "../form/CreatePlaylistForm";
import ConfirmDialog from "../Dialog/ConfirmDialog";

export function AddToPlaylistDialog({ song }: any) {
  const router = useRouter();

  const [fetchStatus, setFetchStatus] = useState(false);
  const [playlist, setPlaylist] = useState<any>();

  const [user, setUser] = useState<any>(null);
  const userState = useAppSelector((state) => state.auth.user);

  const fetchPlaylistList = async () => {
    const playlist = await fetchUserPlaylist();
    if (playlist) {
      setPlaylist(playlist.items);
    }
  };

  const handleSubmit = async (playlistId: any, trackUri: any) => {
    if (userState) {
      let response = await addSongToPlaylist(playlistId, trackUri);

      toast({
        title: "Song added to playlist",
        description: `Your song has been added to the playlist.`,
      });
    } else {
      router.push("/auth");
    }
  };

  useEffect(() => {
    if (!fetchStatus) {
      fetchPlaylistList();
      setFetchStatus(true);
    }
  }, [fetchStatus]);

  useEffect(() => {}, [userState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Icon
            className="bg-primary text-white rounded-lg w-[20px] h-[20px]"
            icon="carbon:add-filled"
          />
        </Button>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Playlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add <span className="underline font-bold">{song.name}</span> to
            Playlist
          </DialogTitle>
          <DialogDescription>
            Add your favorite songs to your playlist.
          </DialogDescription>
        </DialogHeader>
        {playlist?.map(
          (item: any) =>
            item.owner.display_name === (userState as any)?.display_name && (
              <ConfirmDialog
                key={item.id}
                playlist={item.name}
                title={song.name}
                submit={() => handleSubmit(item.id, song.trackUri)}
              >
                <div className="p-2 flex w-full px-5 gap-3 mb-5 cursor-pointer">
                  <Icon
                    className="bg-primary text-white rounded-lg w-[30px] h-[30px]"
                    icon="mingcute:playlist-fill"
                  />
                  <p
                    className={`font-poppins text-lg }
                hover:underline
                `}
                  >
                    {item.name}
                  </p>
                </div>
              </ConfirmDialog>
            )
        )}
        <DialogFooter>
          <div className="w-full items-center flex justify-center">
            <CreatePlaylistDialog setFetchStatus={setFetchStatus} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
