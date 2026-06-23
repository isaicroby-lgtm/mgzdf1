"use client";

function extractImageInfo(htmlString) {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  const images = container.querySelectorAll("img");
  const imageInfoArray = [];

  images.forEach((img, idx) => {
    const src = img.getAttribute("src");
    if (src) {
      // Assign unique ID to each image
      const imgId = `image_${idx + 1}`;
      img.setAttribute("id", imgId);
      img.setAttribute("src", `cid:${imgId}`);
      imageInfoArray.push({
        content_id: imgId,
        content: src,
        type: "image/jpeg",
        filename: imgId,
        disposition: "inline",
        cid: imgId,
      });
    }
  });

  // Return the modified HTML string and the array containing image information
  return { content: container.innerHTML, attachments: imageInfoArray };
}
export default extractImageInfo;
