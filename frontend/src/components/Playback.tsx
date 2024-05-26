"use client";

import { getRefreshToken } from "@/lib/spotify/authWithCodePcke";
import { getTrack, isTokenExpired } from "@/lib/spotify/spotify";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

function WebPlayback() {
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTrack, setCurrentTrack] = useState(null) as any;

  const pathName = usePathname();
  const router = useRouter();

  async function getToken() {
    await getRefreshToken();
  }

  useEffect(() => {
    if (isTokenExpired()) {
      getToken();
    }

    const token = localStorage.getItem("accessToken") as string;
    if (!token) {
      console.error("Access token not found");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      const trackId = pathName.split("/").pop();
      let track = {} as any;
      (async () => {
        if (trackId) {
          console.log("Track ID:", trackId);
          track = await getTrack(trackId);
          setCurrentTrack(track);
        }
      })();

      playerInstance.addListener("ready", async ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        await transferPlaybackHere(device_id, token);
        if (track && track.uri) {
          playTrack(track.uri, token, device_id);
        } else {
          console.warn("Track information not available.");
        }
        setPlayer(playerInstance);
      });

      playerInstance.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      playerInstance.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }

        setPaused(state.paused);
      });

      playerInstance.connect().then((success: boolean) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );
        } else {
          console.error("The Web Playback SDK failed to connect to Spotify.");
        }
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  // useEffect(() => {
  //   if (player && track && track.uri) {
  //     const token = localStorage.getItem("accessToken") as string;
  //     playTrack(track.uri, token);
  //   }
  // }, [isActive]);

  async function transferPlaybackHere(device_id: string, token: string) {
    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [device_id],
        play: true,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to transfer playback", await response.json());
    } else {
      setActive(true);
      console.log("Playback transferred successfully");
    }
  }

  async function playTrack(uri: string, token: string, device_id: string) {
    const trackNow = pathName.split("/").pop();
    const trackNew = uri.split(":").pop();
    if (trackNow === trackNew) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: [uri],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to play track", await response.json());
      } else {
        console.log("Track played successfully", uri);
      }
    }
  }

  const handleTogglePlay = () => {
    if (!player) {
      console.error("Player is not initialized");
      return;
    }

    player
      .togglePlay()
      .then(() => {
        setPaused(!isPaused);
        console.log(isPaused ? "Playing" : "Paused");
      })
      .catch((error: any) => {
        console.error("Failed to toggle play:", error);
      });
  };

  const handleGoBack = () => {
    router.back(); // Kembali ke halaman sebelumnya
  };

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center">
          <b>Loading Spotify Web Playback</b>
        </div>
      </div>
    );
  } else {
    return (
      <div className="max-w-screen-sm mx-auto relative">
        <div className=" flex items-center justify-center h-screen bg-background text-foreground">
          <div className="relative flex flex-col items-center bg-primary p-4 sm:p-8 rounded-lg shadow-lg relative">
            <button
              onClick={handleGoBack}
              className="absolute flex items-center gap-3 top-[-50px] left-0 text-foreground py-2 rounded-lg hover:underline transition"
            >
              <Icon icon="ic:round-arrow-back" />
              Back
            </button>
            {currentTrack &&
              currentTrack.album &&
              currentTrack.album.images &&
              currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-lg mb-2 sm:mb-4"
                  alt="Now Playing Cover"
                />
              )}

            <div className="text-center mb-2 sm:mb-4">
              <div className="text-lg sm:text-2xl font-bold">
                {currentTrack ? currentTrack.name : "No track playing"}
              </div>
              <div className="text-sm sm:text-xl text-secondary-foreground">
                {currentTrack && currentTrack.artists
                  ? currentTrack.artists[0].name
                  : "Unknown artist"}
              </div>
            </div>

            <div className="flex space-x-2 sm:space-x-4">
              <button
                className="bg-secondary text-foreground w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-foreground transition"
                onClick={() => {
                  if (player) {
                    player.previousTrack();
                  }
                }}
              >
                <Icon
                  icon="ic:round-skip-previous"
                  className="w-4 h-4 sm:w-6 sm:h-6"
                />
              </button>

              <button
                className="bg-secondary text-foreground w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-foreground transition"
                onClick={handleTogglePlay}
              >
                <Icon
                  icon={isPaused ? "ic:round-play-arrow" : "ic:round-pause"}
                  className="w-4 h-4 sm:w-6 sm:h-6"
                />
              </button>

              <button
                className="bg-secondary text-foreground w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-foreground transition"
                onClick={() => {
                  if (player) {
                    player.nextTrack();
                  }
                }}
              >
                <Icon
                  icon="ic:round-skip-next"
                  className="w-4 h-4 sm:w-6 sm:h-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WebPlayback;
