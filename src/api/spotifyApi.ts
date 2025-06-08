const BASE_URL = "https://api.spotify.com/v1";

export const getNewReleases = async (token: string) => {
  const response = await fetch(`${BASE_URL}/browse/new-releases?limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch new releases");
  }

  return response.json();
};

export const getNextReleases = async (token: string, nextUrl: string) => {
  const response = await fetch(nextUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch next page of new releases");
  }

  return response.json();
};
 
