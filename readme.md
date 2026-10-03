# Department of Electronics and Communication Engineering - GEC Sreekrishnapuram

A modern, responsive, and dynamic web platform for the Department of Electronics and Communication Engineering (ECE) at Government Engineering College Palakkad (GEC SKP). 

This project is built with a minimalist academic UI and leverages a lightweight, serverless architecture that uses Google Sheets as a headless CMS for easy updates by faculty.

## 🚀 Tech Stack

* **Frontend:** HTML5, JavaScript (Vanilla), Tailwind CSS
* **Data Management:** Google Sheets API (CSV fetching)
* **Hosting & Deployment:** Vercel
* **Version Control:** Git & GitHub

## ✨ Key Features

* **Mobile-First Responsive Design:** Built entirely with Tailwind CSS, ensuring a seamless experience across mobile devices, tablets, and wide desktop monitors.
* **Dynamic Content (No-Code CMS):** Content for pages like *Gallery*, *Projects*, and *Achievements* is dynamically fetched from Google Sheets. This allows non-technical faculty to update the website simply by editing a spreadsheet.
* **Premium Academic UI:** Standardized design system utilizing a clean slate, pure white, and sky-blue color palette with subtle shadows and card-based layouts.
* **Zero-Maintenance Hosting:** Deployed on Vercel with automatic continuous integration (CI) from the main GitHub branch. 

## 📂 Project Structure

* `index.html` - Home page (About, HOD Message, Vision & Mission, News)
* `academics.html` - Academic programs (B.Tech, M.Tech IoT), curriculum, and labs
* `research.html` - Faculty publications, international journals, and patents
* `placements.html` - Career outcomes, preparation tracks, and placement records
* `achievements.html` - Student, faculty, and alumni achievements
* `events.html` / `gallery.html` - Department activities and visual gallery
* `reach-us.html` - Contact information and Google Maps integration
* `styles.css` - Global Tailwind directives and custom overrides

## 🛠️ Local Development

To run this project locally, you don't need any complex build tools like Node.js or Webpack since it uses a CDN/compiled approach for Tailwind and Vanilla JS.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Run a local server:**
   Because the site fetches external CSV data, running it directly from the file system (`file://`) might cause CORS issues. Use a local server:
   * **VS Code:** Install the "Live Server" extension and click "Go Live".
   * **Python:** Run `python -m http.server 8000` in your terminal and visit `http://localhost:8000`.

## 🌐 Deployment

This website is configured to be hosted on **Vercel**. 

1. Push your code to the `main` branch on GitHub.
2. Vercel will automatically trigger a new build and deploy the changes.
3. **Custom Domain:** The site is mapped to the college's infrastructure via a CNAME DNS record, making it accessible at `ece.gecskp.ac.in`.

## 🔮 Future Roadmap

* **Automated Web Scraping:** Implementing a Python-based scraper via GitHub Actions to automatically fetch global college announcements from the main GEC SKP website and sync them to the department site.

---
*Developed for the ECE Department, Government Engineering College Sreekrishnapuram.*
