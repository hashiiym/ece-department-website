const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4qUtrsh-k6BJy4ICBaz-x-Elmdgo4ar650U0vxauLpld6PCk5E1f2IJPq9xgXfFJVhfHyq_BprPLN/pub?gid=0&single=true&output=csv";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  const separator = SHEET_CSV_URL.includes('?') ? '&' : '?';
  const fetchUrl = SHEET_CSV_URL + separator + "t=" + new Date().getTime();
  
  Papa.parse(fetchUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
    complete: function(results) {
      container.innerHTML = '';
      
      if (!results.data || results.data.length === 0) {
        container.innerHTML = '<div class="col-span-full p-4 bg-red-50 text-red-600 rounded-lg">Failed to load gallery images.</div>';
        return;
      }

      const validRows = results.data.filter(row => row.image && String(row.image).trim() !== "");

      if (validRows.length === 0) {
        container.innerHTML = '<div class="col-span-full p-4 bg-red-50 text-red-600 rounded-lg">Failed to load gallery images.</div>';
        return;
      }

      validRows.forEach(row => {
        const item = document.createElement('div');
        item.className = 'break-inside-avoid relative group rounded-xl overflow-hidden mb-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100';
        
        const title = row.title ? String(row.title).trim() : "Untitled";
        const date = row.date ? String(row.date).trim() : "";
        const image = String(row.image).trim();

        item.innerHTML = `
          <img src="${image}" alt="${title}" class="w-full h-auto block" loading="lazy">
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
            <span class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">${date}</span>
            <h3 class="text-lg font-bold leading-tight">${title}</h3>
          </div>
        `;
        
        container.appendChild(item);
      });
    },
    error: function(err) {
      console.error("Error fetching gallery CSV:", err);
      container.innerHTML = '<div class="col-span-full p-4 bg-red-50 text-red-600 rounded-lg">Failed to load gallery images.</div>';
    }
  });
});
