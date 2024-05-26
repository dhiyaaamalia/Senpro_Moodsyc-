import axios from "axios";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  getRefreshToken,
} from "./authWithCodePcke";
import { toast } from "@/components/ui/use-toast";

export function isTokenExpired() {
  let expirationTime = localStorage.getItem("tokenExpiration") as string;
  return expirationTime && Date.now() > parseInt(expirationTime);
}

export async function fetchProfile(accessToken: string) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchUserPlaylist() {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

export async function fetchSongPlaylist(id: string) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (id) {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}

export async function createPlaylist(
  user_id: string,
  title: string,
  visibility: boolean,
  description: string
) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  await axios
    .post(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        name: title,
        public: visibility,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => {
      toast({
        title: "Playlist created",
        description: "Your playlist has been created successfully",
      });
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

export async function searchSong(query: string) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getTrack(id: string) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addSongToPlaylist(playlistId: any, trackUri: any) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}

export async function removeSongFromPlaylist(playlistId: any, trackUri: any) {
  if (isTokenExpired()) {
    await getRefreshToken();
  }
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}
