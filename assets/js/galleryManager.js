const SHEET_CSV_URL = "YOUR_CSV_LINK_HERE";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById('gallery-container')) return;

  const fetchUrl = SHEET_CSV_URL + "?t=" + new Date().getTime();
  
  Papa.parse(fetchUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    transformHeader: function(header) {
      return header.trim();
    },
    complete: function(results) {
      const data = results.data.map(row => ({
        id: row.id ? String(row.id).trim() : Math.random().toString(36).substr(2, 9),
        date: row.date ? String(row.date).trim() : "",
        eventName: row.eventName ? String(row.eventName).trim() : "Gallery Event",
        image: row.image ? String(row.image).trim() : ""
      })).filter(item => item.image); // Only keep items with images

      renderGallery(data);
    },
    error: function(err) {
      console.error("Error fetching gallery CSV:", err);
    }
  });
});

function renderGallery(items) {
  const sliderWrapper = document.getElementById('gallery-slider-wrapper');
  const gridContainer = document.getElementById('gallery-grid');

  if (!sliderWrapper || !gridContainer) return;

  // Split data: first 4 items go to slider, rest go to grid
  const sliderItems = items.slice(0, 4);
  const gridItems = items.slice(4);

  // Render Slider Items
  sliderItems.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide w-full h-full relative';
    slide.innerHTML = `
      <img src="${item.image}" alt="${item.eventName}" class="w-full h-full object-cover">
      <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
        <h3 class="text-white text-2xl font-bold">${item.eventName}</h3>
        <p class="text-gray-300 text-sm mt-1">${item.date}</p>
      </div>
    `;
    sliderWrapper.appendChild(slide);
  });

  // Initialize Swiper
  new Swiper('.gallery-swiper', {
    loop: sliderItems.length > 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    }
  });

  // Render Grid Items
  gridItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'relative overflow-hidden group rounded-lg aspect-square bg-gray-100 cursor-pointer';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.eventName}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h4 class="text-white font-semibold text-lg md:text-xl leading-tight">${item.eventName}</h4>
        <span class="text-gray-300 text-xs md:text-sm mt-1">${item.date}</span>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}
