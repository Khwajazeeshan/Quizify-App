# Quizify Pro - Smart MCQ Test Preparation

Quizify Pro is a premium, high-performance technical assessment platform built with Next.js 15, Tailwind CSS 4, and MongoDB. It's designed to provide a seamless learning experience for developers and students preparing for technical interviews and certification exams.

![Quizify OG Image](public/og-image.png)

## 🚀 Key Features

- **Dynamic Quiz Engine**: Fetches questions directly from MongoDB based on selected topics.
- **Real-time Search**: Instant filtering of study paths on the homepage.
- **Premium UI/UX**: Modern, responsive design with Geist typography and subtle animations.
- **SEO Optimized**: 
  - Dynamic metadata for every quiz topic.
  - Automatically generated `sitemap.xml` and `robots.txt`.
  - Open Graph and Twitter Card integration.
- **Fast Performance**: Server-side rendering (SSR) for initial data fetching and optimized font loading.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Font**: [Geist & Geist Mono](https://vercel.com/font)
- **Deployment**: Vercel ready

## 📂 Project Structure

```text
├── app/
│   ├── quiz/
│   │   └── [topic]/
│   │       ├── page.jsx        # Dynamic Topic Route (SSR)
│   │       └── QuizClient.jsx   # Interactive Quiz Logic (Client)
│   ├── layout.js               # Global Layout & SEO Metadata
│   ├── page.jsx                # Landing Page (SSR)
│   ├── SearchTopics.jsx        # Client-side Search Component
│   ├── sitemap.js              # Dynamic Sitemap Generator
│   └── robots.js               # Robots.txt Generator
├── lib/
│   └── mongodb.js              # MongoDB Connection Utility
├── public/                     # Static Assets (Icons, Images)
├── next.config.mjs             # Next.js Configuration
└── package.json                # Dependencies & Scripts
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Khwajazeeshan/Quizify-App
cd Quizify-App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db-name
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📈 Performance & SEO Best Practices

- **Image Optimization**: All branding and decorative elements are optimized for fast loading.
- **Semantic HTML**: Proper use of `<h1>` through `<h3>` tags for better indexing.
- **Dynamic Metadata**: Title and description tags update automatically based on the quiz topic.
- **Sitemap**: A dynamic sitemap at `/sitemap.xml` ensures search engines find all your quiz topics.


## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Khawaja Zeeshan]
