# 🎧 DevSoulify – Frontend Challenge

Welcome! This is the official frontend technical challenge for developers who want to join **DevSoul**.  
Your mission is to build a production-ready web app using the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

You'll be creating a beautiful music feed UI using real data from Spotify: new releases, featured playlists and music genres.

---

## 🚀 First Step

Choose **one** of the following technologies to develop the challenge:

- React
- Angular (version X or above)

Then, fork this repository and start coding your solution.

---

## ✨ What We’ll Look For

- ✅ A clean and scalable **architecture**
- ✅ Use of **SOLID principles**
- ✅ Thoughtful **code structure** and modularity
- ✅ Presence of **unit tests**
- ✅ Meaningful and atomic **Git commits**
- ✅ A **working online demo**
- ✅ A good **UX/UI**

Bonus points if your code is easy to read and feels production-ready.

---

## 🧪 Requirements

Your app must:

1. **Authenticate with Spotify**
   - Use the [Implicit Grant Flow](https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow) or any secure method to get an access token.
   - You’ll need to create an app on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

2. **Display this content** from the Spotify API:
   - **Released This Week**  
     → `GET /browse/new-releases`
   - **Featured Playlists**  
     → `GET /browse/featured-playlists`

3. Have a responsive and engaging UI:
   - Feed-style layout
   - Cards with album/playlist images, titles, and subtitles
   - A clean grid layout that works well on both mobile and desktop  
     → Ideally, implement **infinite scroll** if the API supports pagination

---

## Example Images
![Screenshot 2025-06-06 at 00 49 38](https://github.com/user-attachments/assets/95bb46c6-9cda-49d9-b544-57303773a9af)

---

## 📦 Project Setup

Your app should be able to run on **any machine** by following these steps:

```bash
npm install
npm test
npm start
