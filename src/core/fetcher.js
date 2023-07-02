export const fetcher = async (url) => {
  return fetch(url).then((res) => res.json());
};
