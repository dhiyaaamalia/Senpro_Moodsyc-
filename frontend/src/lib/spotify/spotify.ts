import axios from "axios";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  getRefreshToken,
} from "./authWithCodePcke";
import { toast } from "@/components/ui/use-toast";

function isTokenExpired() {
  let expirationTime = localStorage.getItem("tokenExpiration");
  return expirationTime && Date.now() > parseInt(expirationTime);
}

export async function fetchProfile(accessToken: string) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return await result.json();
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
