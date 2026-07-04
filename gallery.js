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
      tile.innerHTML = `<img src="${imgUrl}" alt="${item.title || ""}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
      container.appendChild(tile);
    });
  } catch (err) {
    console.error("Failed to load gallery:", err);
  }
}

loadGallery();