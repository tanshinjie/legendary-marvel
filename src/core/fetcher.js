const get = (url) => {
  return fetch(url).then((res) => res.json());
};

const post = (url, { arg }) =>
  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  }).then((res) => res.json());

const fetcher = {};

fetcher.get = get;
fetcher.post = post;

export default fetcher;
