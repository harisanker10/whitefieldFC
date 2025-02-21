export function $api(
  path: string,
  {
    method,
    body,
  }: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, any>;
  },
) {
  return fetch(`https://whitefieldfc.onrender.com/api/v1/${path}`, {
    // return fetch(`http://localhost:3000/api/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
    body: body && JSON.stringify(body),
  })
    .then((data) => data.ok && data.json())
    .then((data) => data)
    .catch((err) => console.log(err));
}
