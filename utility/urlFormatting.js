export function encodeStaticURL(str) {
  // this function is only for static pages | pages whose links don't appear in the browser URL
  const encodedStr = str.replace(/ /g, "-").toLowerCase();
  return encodedStr;
}

export function decodeStaticURL(str) {
  // this function is only for static pages | pages whose links don't appear in the browser URL

  const decodedStr = str.replace(/-+/g, (match) => " ".repeat(match.length));
  return decodedStr;
}

export function encodeURL(title) {
  if (!title) return "";
  let url = encodeURIComponent(title.replace(/\s+/g, "-"));

  return url;
}

export function decodeURL(url) {
  if (!url) return "";

  let decodedString = decodeURIComponent(url);

  let title = decodedString
    .replace(/-/g, " ")
    .replace(/%2C/g, "")
    .toLowerCase();

  return title;
}
