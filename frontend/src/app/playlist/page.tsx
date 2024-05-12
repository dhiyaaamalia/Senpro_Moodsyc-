import PlaylistList from "@/components/List/Playlist";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playlist",
  description: "Playlist page for users to see their playlist.",
};

const PlaylistPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-24 py-16">
      <Navbar />
      <PlaylistList />
    </main>
  );
};

export default PlaylistPage;
