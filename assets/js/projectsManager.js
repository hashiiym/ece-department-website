const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT80ESm0kCmlEGGt8nOjRB0SE3YvYTFS-Jm4SsTSfJ3T-YX6tjn2wz08Q8TftUVS6SZHkNUxufQLNz7/pub?gid=0&single=true&output=csv";
let allProjects = [];
let activeYear = "All";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const separator = SHEET_CSV_URL.includes('?') ? '&' : '?';
  const fetchUrl = SHEET_CSV_URL + separator + "t=" + new Date().getTime();

  Papa.parse(fetchUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
    complete: function (results) {
      if (!results.data || results.data.length === 0) {
        container.innerHTML = '<div class="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load projects. Check CSV headers.</div>';
        return;
      }

      allProjects = results.data.filter(row => row.title && String(row.title).trim() !== "");

      if (allProjects.length === 0) {
        container.innerHTML = '<div class="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load projects. Check CSV headers.</div>';
        return;
      }

      // Extract Unique Years
      const uniqueYears = [...new Set(allProjects.map(p => p.year).filter(Boolean))].sort((a, b) => String(b).localeCompare(String(a)));

      // Unshift "All" to the beginning
      uniqueYears.unshift("All");

      // Default to "All"
      activeYear = "All";

      generateSidebarButtons(uniqueYears);
      filterAndRender();
    },
    error: function (err) {
      console.error("Error fetching projects CSV:", err);
      container.innerHTML = '<div class="p-4 bg-red-50 text-red-600 rounded-lg">Failed to load projects. Check CSV headers.</div>';
    }
  });
});

function generateSidebarButtons(uniqueYears) {
  const container = document.getElementById('year-filters');
  if (!container) return;

  container.innerHTML = '';

  uniqueYears.forEach(year => {
    const btn = document.createElement('button');
    btn.dataset.year = year;
    btn.textContent = year;
    // The classes will be applied in filterAndRender
    btn.className = 'px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none year-btn text-left';

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
  let filteredData = allProjects;
  if (activeYear !== "All") {
    filteredData = allProjects.filter(project => project.year === activeYear);
  }

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

  data.forEach(row => {
    const card = document.createElement('div');
    card.className = 'flex flex-col md:flex-row gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100 mb-6';

    let imageBlock = '';
    if (row.image && String(row.image).trim() !== '') {
      imageBlock = `
        <div class="w-full md:w-1/3 shrink-0">
          <img src="${String(row.image).trim()}" alt="${row.title || 'Project Image'}" class="w-full h-48 md:h-full object-cover rounded-lg">
        </div>
      `;
    }

    let yearBadge = '';
    if (row.year && String(row.year).trim() !== '') {
      yearBadge = `<span class="inline-block px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full w-max mb-3">${String(row.year).trim()}</span>`;
    }

    let descriptionHtml = '';
    if (row.description && String(row.description).trim() !== '') {
      descriptionHtml = `<p class="text-slate-600 mt-2 text-justify leading-relaxed break-words text-sm md:text-base">${String(row.description).trim()}</p>`;
    }

    let teamHtml = '';
    if (row.teammembers && String(row.teammembers).trim() !== '') {
      teamHtml = `<p class="mt-4 text-sm font-medium text-slate-800"><span class="text-slate-500">Team:</span> ${String(row.teammembers).trim()}</p>`;
    }

    let pdfHtml = '';
    if (row.pdflink && String(row.pdflink).trim() !== '') {
      pdfHtml = `<a href="${String(row.pdflink).trim()}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center w-max mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">View Report PDF</a>`;
    }

    card.innerHTML = `
      ${imageBlock}
      <div class="flex-1 flex flex-col justify-center">
        ${yearBadge}
        <h3 class="text-2xl font-bold text-slate-900">${row.title || 'Untitled Project'}</h3>
        ${descriptionHtml}
        ${teamHtml}
        ${pdfHtml}
      </div>
    `;

    container.appendChild(card);
  });
}
