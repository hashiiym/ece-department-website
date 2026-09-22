const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHEp9GcC_ATR5ShcMLnWmfbkhlzsQUYho4AWurey3qZEd062h7zjQG-rofF7MZqkg3bLJGmREb987E/pub?gid=0&single=true&output=csv";

function renderNewsSlider(majorNews) {
  const newsSliderSection = document.getElementById('news-slider-section');
  const swiperWrapper = document.getElementById('swiper-wrapper');
  const dateBadge = document.getElementById('slider-date-badge');

  if (!newsSliderSection || !swiperWrapper || !dateBadge) return;

  majorNews.forEach(news => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.style.backgroundColor = '#e5e7eb'; 
    
    slide.innerHTML = `
      <div class="slide-image-wrapper">
        ${news.image ? `<img src="${news.image}" alt="${news.title}" />` : `<div class="placeholder">No Image</div>`}
        <div class="slide-overlay">
          <h3 class="slide-title">${news.title}</h3>
        </div>
      </div>
    `;
    swiperWrapper.appendChild(slide);
  });

  const updateDateBadge = (index) => {
    const event = majorNews[index];
    if(event) {
      dateBadge.innerHTML = `
        <strong>${event.date.day}</strong>
        <span>${event.date.monthYear.split(' ')[0]}</span>
        <span>${event.date.monthYear.split(' ')[1]}</span>
      `;
    }
  };

  const swiper = new Swiper('.mySwiper', {
    direction: 'vertical',
    effect: 'cards',
    grabCursor: true,
    on: {
      init: function () {
        updateDateBadge(this.activeIndex);
      },
      slideChange: function () {
        updateDateBadge(this.activeIndex);
      }
    }
  });

  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (prevBtn) prevBtn.addEventListener('click', () => swiper.slidePrev());
  if (nextBtn) nextBtn.addEventListener('click', () => swiper.slideNext());
}

function renderCalendarAccordion(regularEvents) {
  const accordionList = document.getElementById('accordion-list');
  if (!accordionList) return;

  let eventsToRender = regularEvents;
  
  // Optimization: If we are on the index/home page, only render the top 3 events
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
  if (isHomePage) {
    eventsToRender = eventsToRender.slice(0, 3);
  }

  eventsToRender.forEach(event => {
    const row = document.createElement('div');
    row.className = 'accordion-row';
    
    row.innerHTML = `
      <div class="accordion-header">
        <div class="accordion-date">
          <strong>${event.date.day}</strong>
          <div class="month-year">${event.date.monthYear}</div>
        </div>
        <h3 class="accordion-title">${event.title}</h3>
        <div class="accordion-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      <div class="accordion-content">
        <div class="accordion-inner">
          ${event.description}
        </div>
      </div>
    `;
    
    const header = row.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      
      // Close all rows
      document.querySelectorAll('.accordion-row').forEach(r => r.classList.remove('open'));
      
      // Open clicked row if it wasn't open
      if (!isOpen) {
        row.classList.add('open');
      }
    });

    accordionList.appendChild(row);
  });
}

async function fetchAndRenderEvents() {
  const cacheBusterUrl = SHEET_CSV_URL + "&t=" + new Date().getTime();
  Papa.parse(cacheBusterUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      // Map flat CSV rows to the nested structure
      const parsedData = results.data.map(row => {
        return {
          id: row.id || Math.random().toString(36).substr(2, 9),
          date: { 
            day: row.day || "", 
            monthYear: row.monthYear || "" 
          },
          title: row.title || "",
          description: row.description || "",
          image: row.image || "",
          isMajorNews: row.isMajorNews ? row.isMajorNews.trim().toLowerCase() === 'true' : false
        };
      });

      const majorNews = parsedData.filter(event => event.isMajorNews);
      const regularEvents = parsedData.filter(event => !event.isMajorNews);

      renderNewsSlider(majorNews);
      renderCalendarAccordion(regularEvents);
    },
    error: function(err) {
      console.error("Error fetching events from CSV:", err);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderEvents();
});
