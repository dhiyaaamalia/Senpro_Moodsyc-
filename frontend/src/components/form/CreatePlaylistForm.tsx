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

export function CreatePlaylistDialog() {
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
        <Button>
          <Icon
            className="bg-primary text-white rounded-lg w-[20px] h-[20px] mr-3"
            icon="carbon:add-filled"
          />
          Create playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription>
            Create a new playlist to add your favorite songs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Description
            </Label>
            <Input
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="description"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Visibility
            </Label>
            <Select
              onValueChange={(value) => {
                setVisibility(value === "true");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Visibility</SelectLabel>
                  <SelectItem value="true">Public</SelectItem>
                  <SelectItem value="false">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreatePlaylist} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
