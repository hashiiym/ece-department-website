const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHEp9GcC_ATR5ShcMLnWmfbkhlzsQUYho4AWurey3qZEd062h7zjQG-rofF7MZqkg3bLJGmREb987E/pub?gid=1106157173&single=true&output=csv";
let allProjects = [];
let activeYear = "All";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById('projects-container')) return;

  const fetchUrl = SHEET_CSV_URL + "?t=" + new Date().getTime();

  Papa.parse(fetchUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      allProjects = results.data.map(row => ({
        id: row.id ? String(row.id).trim() : Math.random().toString(36).substr(2, 9),
        year: row.year ? String(row.year).trim() : "Unknown",
        title: row.title ? String(row.title).trim() : "Untitled Project",
        description: row.description ? String(row.description).trim() : "",
        circuitDiagram: row.circuitDiagram ? String(row.circuitDiagram).trim() : ""
      })).filter(item => item.title !== "Untitled Project");

      if (allProjects.length > 0) {
        // Extract Unique Years
        const uniqueYears = [...new Set(allProjects.map(p => p.year))].sort((a, b) => b.localeCompare(a));
        
        // Default to newest year
        activeYear = uniqueYears[0];
        
        generateSidebarButtons(uniqueYears);
        filterAndRender();
      }
    },
    error: function (err) {
      console.error("Error fetching projects CSV:", err);
    }
  });
});

function generateSidebarButtons(uniqueYears) {
  const container = document.getElementById('year-filters');
  if (!container) return;

  container.innerHTML = '';

  uniqueYears.forEach(year => {
    const btn = document.createElement('button');
    // Default inactive classes
    btn.className = 'px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none year-btn text-left';
    btn.dataset.year = year;
    btn.textContent = year;

    btn.addEventListener('click', () => {
      activeYear = year;
      filterAndRender();
    });

    container.appendChild(btn);
  });
}

function filterAndRender() {
  // Visually highlight the active button
  document.querySelectorAll('.year-btn').forEach(btn => {
    if (btn.dataset.year === activeYear) {
      btn.className = 'px-4 py-2 text-sm font-semibold rounded-full border border-blue-600 bg-blue-600 text-white transition-colors focus:outline-none year-btn text-left';
    } else {
      btn.className = 'px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none year-btn text-left';
    }
  });

  // Filter the master CSV data array
  const filteredData = allProjects.filter(project => project.year === activeYear);
  
  // Call renderProjects
  renderProjects(filteredData);
}

function renderProjects(data) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No projects found for this year.</p>';
    return;
  }

  // Create flex column container for featured + grid
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-8 w-full';

  // 1. Render Featured Project (First Item)
  const featured = data[0];
  const featuredCard = document.createElement('div');
  featuredCard.className = 'w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden';
  
  let featuredImgHtml = '';
  if (featured.circuitDiagram) {
    featuredImgHtml = `
      <div class="w-full h-[300px] md:h-[400px] bg-gray-50 flex items-center justify-center p-4">
         <img src="${featured.circuitDiagram}" alt="${featured.title}" class="w-full h-full object-contain">
      </div>
    `;
  }
  
  featuredCard.innerHTML = `
    ${featuredImgHtml}
    <div class="p-6 md:p-8">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">${featured.title}</h2>
      <p class="text-gray-600 leading-relaxed">${featured.description}</p>
    </div>
  `;
  wrapper.appendChild(featuredCard);

  // 2. Render Remaining Projects Grid
  const remaining = data.slice(1);
  if (remaining.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';

    remaining.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow';
      
      let imgHtml = '';
      if (item.circuitDiagram) {
        imgHtml = `
          <div class="w-full h-48 bg-gray-50 rounded-lg overflow-hidden mb-4 p-2 flex items-center justify-center">
            <img src="${item.circuitDiagram}" alt="${item.title}" class="w-full h-full object-contain">
          </div>
        `;
      }

      card.innerHTML = `
        ${imgHtml}
        <h3 class="text-xl font-bold text-gray-900 mb-2">${item.title}</h3>
        <p class="text-gray-600 text-sm leading-relaxed flex-1">${item.description}</p>
      `;
      grid.appendChild(card);
    });
    wrapper.appendChild(grid);
  }

  container.appendChild(wrapper);
}
