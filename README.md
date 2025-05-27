# redditR

A simple Reddit feed searcher and reader built with Next.js, TypeScript, Tailwind CSS, and Jotai for state management.

The app retrieves articles from each subreddits' XML RSS feed using DOMParser on NextJS back-end.

## Features

- Search for subreddits and add them to your subscriptions
- View the latest articles from your subscribed subreddits
- Subscriptions are stored in local storage for persistence
- Drag-and-drop to reorder your subreddit panels
- Responsive and modern UI with Tailwind CSS

## Tech Stack

- **Next.js** for server-side rendering and routing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Jotai** for global state management
- **React** for UI components
- **DOMParser** for extracting articles from XML RSS feeds

## Getting Started

1. **Install dependencies:**

   ```sh
   yarn install
   ```

2. **Run the development server:**

   ```sh
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Purpose

This project was created as a fun project to search for and follow subreddits, storing your subscriptions in local storage and learning how to use Jotai for state management. It uses DOMParser to extract articles from RSS feeds for each subreddit.

---

Made with 🩶 by [Martin](https://github.com/martinDM)
