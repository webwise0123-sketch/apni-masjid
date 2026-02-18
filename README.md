# Apni Masjid - PWA Prototype

A responsive Progressive Web App (PWA) prototype for finding nearby Masjids and their Jamat times. Built with Vue 3, Vite, and Tailwind CSS.

## Features

- **Namaz Tab**:
  - Simulated geolocation to find nearby Masjids.
  - List of Masjids with distance and next Jamat time.
  - "verified" badge support.
  - Map placeholder with animations.
- **Trending Tab**:
  - Feed of updates from Masjids and users.
- **Add Post Tab**:
  - Form to simulate posting updates.
- **Settings Tab**:
  - Profile and preference toggles (Dark mode, Notifications).
- **Masjid Details**:
  - Detailed view with Namaz times, events, and simulated distance.

## Tech Stack

- **Framework**: Vue 3 (Composition API) + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Routing**: Vue Router 4
- **State**: Local simulating API calls
- **PWA**: vite-plugin-pwa (Auto-update, Manifest)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

4.  **Preview Production Build**:
    ```bash
    npm run preview
    ```

## Project Structure

- `src/views`: Main page views (Namaz, Trending, AddPost, Settings, MasjidDetail).
- `src/components`: Reusable components (BottomNav, MasjidCard).
- `src/data`: Dummy JSON data (`masjids.json`).
