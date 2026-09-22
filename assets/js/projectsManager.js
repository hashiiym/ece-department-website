const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHEp9GcC_ATR5ShcMLnWmfbkhlzsQUYho4AWurey3qZEd062h7zjQG-rofF7MZqkg3bLJGmREb987E/pub?gid=1106157173&single=true&output=csv";
let allProjects = [];

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById('projects-container')) return;

  const fetchUrl = SHEET_CSV_URL + "?t=" + new Date().getTime();

  Papa.parse(fetchUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      allProjects = results.data.map(row => ({
        id: row.id || Math.random().toString(36).substr(2, 9),
        year: row.year || "Unknown",
        title: row.title || "Untitled Project",
        description: row.description || "",
        circuitDiagram: row.circuitDiagram || ""
      })).filter(item => item.title !== "Untitled Project");

      renderSidebar();

      // Default to the most recent year if projects exist
      if (allProjects.length > 0) {
        const uniqueYears = [...new Set(allProjects.map(p => p.year))].sort((a, b) => b.localeCompare(a));
        filterByYear(uniqueYears[0]);
      }
    },
    error: function (err) {
      console.error("Error fetching projects CSV:", err);
    }
  });
});

function renderSidebar() {
  const container = document.getElementById('year-filter-container');
  if (!container) return;

  container.innerHTML = '';

  // Extract unique years and sort descending
  const uniqueYears = [...new Set(allProjects.map(p => p.year))].sort((a, b) => b.localeCompare(a));

  uniqueYears.forEach(year => {
    const btn = document.createElement('button');
    btn.className = 'px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none year-btn';
    btn.dataset.year = year;
    btn.textContent = year;

    btn.addEventListener('click', () => {
      filterByYear(year);
    });

    container.appendChild(btn);
  });
}

function filterByYear(selectedYear) {
  // Update active state of buttons
  document.querySelectorAll('.year-btn').forEach(btn => {
    if (btn.dataset.year === selectedYear) {
      btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
      btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
      btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    }
  });

  const filtered = allProjects.filter(p => p.year === selectedYear);
  renderMainContent(filtered);
}

function renderMainContent(projects) {
  const featuredEl = document.getElementById('featured-project');
  const featuredImg = document.getElementById('featured-image');
  const featuredTitle = document.getElementById('featured-title');
  const featuredDesc = document.getElementById('featured-desc');
  const gridContainer = document.getElementById('projects-grid');

  if (!gridContainer || projects.length === 0) {
    if (featuredEl) featuredEl.classList.add('hidden');
    if (gridContainer) gridContainer.innerHTML = '<p class="text-gray-500 col-span-2">No projects found for this year.</p>';
    return;
  }

  // Render Featured (first project)
  const featuredProject = projects[0];
  if (featuredProject.circuitDiagram) {
    featuredImg.src = featuredProject.circuitDiagram;
    featuredImg.parentElement.style.display = 'flex';
  } else {
    featuredImg.parentElement.style.display = 'none';
  }
  featuredTitle.textContent = featuredProject.title;
  featuredDesc.textContent = featuredProject.description;
  featuredEl.classList.remove('hidden');

  // Render Grid (remaining projects)
  gridContainer.innerHTML = '';
  const remaining = projects.slice(1);

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

    gridContainer.appendChild(card);
  });
}
