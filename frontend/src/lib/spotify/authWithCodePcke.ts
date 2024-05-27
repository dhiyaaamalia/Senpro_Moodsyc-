import axios from "axios";

function saveTokenToLocalStorage(responseData: any) {
  const expirationTime = Date.now() + responseData.expires_in * 1000;
  localStorage.setItem("accessToken", responseData.access_token);
  localStorage.setItem("tokenExpiration", expirationTime.toString());
  localStorage.setItem("refreshToken", responseData.refresh_token);
}

export async function redirectToAuthCodeFlow() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
  const callback = process.env.NEXT_PUBLIC_SPOTIFY_CALLBACK as string;
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  var scope =
    "streaming user-modify-playback-state user-read-private user-read-email playlist-read-private  playlist-modify-private playlist-modify-public";

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", callback);
  params.append("scope", scope);
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string) {
  const verifier = localStorage.getItem("verifier");
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string;

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/auth/");
  params.append("code_verifier", verifier!);
  params.append("client_secret", clientSecret);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

export async function getRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken") as string;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    saveTokenToLocalStorage(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  const digestArray = Array.from(new Uint8Array(digest));

  return btoa(String.fromCharCode.apply(null, digestArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
