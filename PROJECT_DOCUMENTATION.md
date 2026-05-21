# Sri Seetha Ramachandra Swamy Temple Website - Project Documentation

## Project Overview
**Website Name:** Sri Seetha Ramachandra Swamy Temple
**Live URL:** [https://sriseetharamachandraswamytemple.netlify.app/](https://sriseetharamachandraswamytemple.netlify.app/)
**Location:** Saigudem, Aler, Yadadri Bhongiri District, Telangana.

This project is a static website powered by dynamic content fetched from a **Google Sheet**. It allows temple administrators to update content (Announcements, Darshan Timings, Gallery, etc.) without editing code.

## Key Features
*   **Dynamic Content:** Fetches data for Announcements, Festivals, Darshan Timings, and Gallery from Google Sheets.
*   **Sitemap & SEO:** Fully configured `sitemap.xml` and `robots.txt` for Google indexing. Optimized for "Saigudem Temple" searches.
*   **Responsive Design:** Works seamlessly on Mobile and Desktop.
*   **Media Gallery:** Horizontal scrolling gallery with lightbox support.
*   **E-Hundi (Info):** Displays bank details and generates information receipts.
*   **Volunteer Registration:** Form to register volunteers (submissions go to Google Sheets).

## File Structure
```
/
├── index.html            # Main Website File (Single Page Application structure)
├── sitemap.xml           # Sitemap for Google Search Console
├── robots.txt            # Instructions for Search Engine Crawlers
├── netlify.toml          # Deployment configuration for Netlify
├── styles/
│   ├── main.css          # Main stylesheet
│   ├── variables.css     # Color variables (Maroon/Gold theme)
│   └── components.css    # Styles for Modals, Cards, Buttons
├── scripts/
│   ├── main.js           # UI Logic (modals, navigation, interactions)
│   ├── render.js         # Content Rendering Logic (takes data -> writes HTML)
│   ├── api.js            # Fetches data from Google Apps Script URL
│   └── mockData.js       # Fallback data if API fails
└── assets/               # Images and Audio files
```

## Configuration & Deployment

### 1. Google Sheet Backend
The website connects to a Google Apps Script Web App.
*   **Script URL:** Configured in `scripts/api.js`.
*   **Current Mode:** `USE_MOCK: false` (Live Mode).

### 2. Hosting (Netlify)
*   **Build Command:** (None / Blank)
*   **Publish Directory:** `.` (Current Directory) - *Crucially configured in `netlify.toml`*

### 3. SEO & Sitemap
*   **Domain:** `https://sriseetharamachandraswamytemple.netlify.app/`
*   **Sitemap URL:** `https://sriseetharamachandraswamytemple.netlify.app/sitemap.xml`
*   **Search Console:** The sitemap has been submitted and verified.
*   **Updates:** To update the sitemap date, manually edit the `<lastmod>` tag in `sitemap.xml` before a major deployment.

## How to Update Content
**Do NOT edit the code** for these changes. Go to the linked **Google Sheet**:
1.  **Announcements:** Add rows to the 'Announcements' tab.
2.  **Gallery:** Add image URLs to the 'Gallery' tab.
3.  **Festivals:** Update the 'Festivals' tab.
4.  **Darshan:** Update timings in the 'Darshan' tab.

The website will automatically reflect these changes upon refresh.

## Credits
**Developed for:** Sri Seetha Ramachandra Swamy Devasthanam
**Tech Stack:** HTML5, CSS3, JavaScript (Vanilla), Google Apps Script.
