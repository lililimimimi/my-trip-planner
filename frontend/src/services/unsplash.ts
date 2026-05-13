const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const getPlaceImage = async (query: string): Promise<string> => {
  try {
    const resp = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${ACCESS_KEY}`,
    );
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small;
    }
    return "";
  } catch {
    return "";
  }
};
