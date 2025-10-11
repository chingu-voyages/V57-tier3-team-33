import { api } from "../lib/axios";

const baseUrl = import.meta.env.VITE_API_URL;
export async function signIn(idToken: string, githubAccessToken: string) {
  const response = await api.request({
    url: `${baseUrl}/auth/signin`,
    method: "POST",
    data: {
      idToken,
      githubAccessToken,
    },
  });
  return response.status === 200 ? response.data : null;
}
