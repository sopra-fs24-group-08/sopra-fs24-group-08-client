// src/helpers/avatarAPI.js

async function fetchCatAvatar(name) {
  // Determine the URL to use based on the environment
  const baseUrl = process.env.NODE_ENV === "production"
    ? "https://sopra-fs24-group-08-client.oa.r.appspot.com/api/proxy/cat-avatar" // Production Environment URL
    : "http://localhost:8080/api/proxy/cat-avatar"; // Development Environment URL

  const response = await fetch(`${baseUrl}?name=${name}`);
  if (response.ok) {
    const blob = await response.blob(); // Get binary image data

    return URL.createObjectURL(blob); // Create a temporary URL to access the downloaded image
  } else {
    throw new Error("Failed to load image");
  }
}

export { fetchCatAvatar };