export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  /*
  There is an JavaScript operator calles the optional
  chaing operator.  It is used to handle nested values
  wuthout throwing an error if a part returns null/undefined.
  docuemnted at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

  I didn't know you can't use dotenv in the front end.
  The workaround after a google search is import.meta which has documentation 
  here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta
  */
  const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:3000";
  console.log("Calling API:", `${API_BASE}/api${path}`);
  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok)
    throw new Error(`API error: ${response.status} ${response.statusText}`);

  return response.json();
}
