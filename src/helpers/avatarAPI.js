// src/helpers/avatarAPI.js

async function fetchCatAvatar(name) {
  // Determine the URL to use based on the environment
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://sopra-fs24-group-08-client.appspot.com/api/proxy/cat-avatar' // Production Environment URL
    : 'http://localhost:8080/api/proxy/cat-avatar'; // Development Environment URL

  const response = await fetch(`${baseUrl}?name=${name}`);
  if (response.ok) {
    const blob = await response.blob(); // 获取二进制图像数据
    return URL.createObjectURL(blob); // 创建一个临时的 URL 来访问下载的图像
  } else {
    throw new Error('Failed to load image');
  }
}
export { fetchCatAvatar };