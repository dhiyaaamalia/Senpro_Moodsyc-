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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react/dist/iconify.js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createPlaylist } from "@/lib/spotify/spotify";
import { toast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function AddToPlaylistDialog() {
  const [title, setTitle] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const handleCreatePlaylist = async () => {
    const user =
      localStorage.getItem("profile") &&
      JSON.parse(localStorage.getItem("profile")!);

    await createPlaylist(user.id, title, visibility, description);
  };

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button>
                <Icon
                  className="bg-primary text-white rounded-lg w-[20px] h-[20px]"
                  icon="carbon:add-filled"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Playlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription>
            Create a new playlist to add your favorite songs.
          </DialogDescription>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <Button onClick={handleCreatePlaylist} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
