const PROJECT_ID = "hiaonaj4";
const DATASET = "production";

async function loadGallery() {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=*[_type=="galleryImage"] | order(_createdAt desc)`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById("gallery-rows");
    container.innerHTML = "";

    data.result.forEach((item) => {
      if (!item.image || !item.image.asset) return;

      const ref = item.image.asset._ref;
      const parts = ref.split("-");
      const id = parts[1];
      const dimensions = parts[2];
      const ext = parts[3];
      const imgUrl = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${ext}`;

      const tile = document.createElement("div");
      tile.className = "gallery-tile";
      tile.style.width = "calc(33.33% - 8px)";
      tile.style.height = "220px";
      tile.style.overflow = "hidden";
      tile.style.borderRadius = "8px";
      tile.style.cursor = "pointer";
      tile.innerHTML = `<img src="${imgUrl}" alt="${item.title || ""}" style="width:100%;height:100%;object-fit:cover;display:block;">`;

      tile.addEventListener("click", () => openLightbox(imgUrl, item.title || ""));

      container.appendChild(tile);
    });
  } catch (err) {
    console.error("Failed to load gallery:", err);
  }
}

function openLightbox(imgUrl, caption) {
  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 9999; cursor: zoom-out;
  `;

  overlay.innerHTML = `
    <img src="${imgUrl}" style="max-width:90%; max-height:80%; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
    <p style="color:white; margin-top:16px; font-size:16px;">${caption}</p>
    <span style="position:absolute; top:20px; right:30px; color:white; font-size:32px; cursor:pointer;">&times;</span>
  `;

  overlay.addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
}

loadGallery();