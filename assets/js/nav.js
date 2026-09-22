document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mainNav = document.querySelector(".main-nav");

  if (mobileMenuBtn && mobileMenu && mainNav) {
    // Clone the main nav links into the mobile menu
    const navClone = mainNav.cloneNode(true);
    navClone.className = "flex flex-col p-4 gap-2";
    
    // Convert dropdowns for mobile
    const navItems = navClone.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      const trigger = item.querySelector(".nav-trigger");
      const dropdown = item.querySelector(".nav-dropdown");
      
      if (trigger && dropdown) {
        // Change dropdown styles to be static for mobile accordion style
        dropdown.className = "hidden flex-col pl-4 mt-2 border-l-2 border-gray-200";
        dropdown.style = "position: static; transform: none; box-shadow: none; background: transparent; border: none; opacity: 1; visibility: visible; pointer-events: auto; padding: 0;";
        
        // Remove existing hover CSS classes by modifying HTML
        item.classList.remove("nav-item");
        
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          dropdown.classList.toggle("hidden");
          dropdown.classList.toggle("flex");
        });
      }
    });

    mobileMenu.appendChild(navClone);

    // Toggle menu visibility
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});
