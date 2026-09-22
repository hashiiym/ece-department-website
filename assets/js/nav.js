document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mainNav = document.querySelector(".main-nav");

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("mobile-open");
    });

    // Handle dropdown toggles on mobile
    const navItems = mainNav.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      const trigger = item.querySelector(".nav-trigger");
      const dropdown = item.querySelector(".nav-dropdown");
      
      if (trigger && dropdown) {
        trigger.addEventListener("click", (e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
            dropdown.classList.toggle("open");
          }
        });
      }
    });
  }
});
