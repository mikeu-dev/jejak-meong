<div align="center">

# 🐱 Jejak Meong

**Platform Komunitas untuk Menemukan Kucing Hilang**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/jejak-meong)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange)](https://firebase.google.com/)

[Demo](https://jejak-meong.vercel.app) • [Dokumentasi](docs/USER_GUIDE.md) • [Laporkan Bug](https://github.com/yourusername/jejak-meong/issues)

</div>

---

## 📖 Tentang Jejak Meong

**Jejak Meong** adalah aplikasi web yang membantu komunitas pecinta kucing untuk melaporkan dan menemukan kucing yang hilang atau ditemukan di sekitar mereka. Dengan tampilan peta interaktif dan fitur AI untuk identifikasi ras kucing, kami membuat proses pencarian menjadi lebih mudah dan efektif.

### ✨ Fitur Utama

- 🗺️ **Peta Interaktif** - Lihat laporan kucing berdasarkan lokasi geografis menggunakan OpenLayers
- 📝 **Pelaporan Mudah** - Laporkan kucing hilang/ditemukan dengan foto dan detail lokasi
- 🤖 **AI Breed Detection** - Identifikasi ras kucing otomatis menggunakan Google AI (Gemini)
- 🔐 **Login Aman** - Autentikasi dengan Google melalui Firebase
- 🌍 **Multibahasa** - Tersedia dalam Bahasa Indonesia dan Inggris
- 🌓 **Dark Mode** - Tema gelap untuk kenyamanan mata
- 📱 **Responsive Design** - Optimal di desktop dan mobile
- 📲 **PWA Ready** - Install sebagai aplikasi di perangkat Anda

## 🚀 Quick Start

### Prasyarat

- Node.js 20.x atau lebih baru
- npm atau yarn
- Akun Firebase (gratis)
- Google AI API Key (gratis)

### Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/jejak-meong.git
   cd jejak-meong
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Kemudian isi dengan konfigurasi Firebase dan Google AI Anda:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # Google AI (Genkit)
   GOOGLE_GENAI_API_KEY=your-google-ai-key
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   
   Buka [http://localhost:9002](http://localhost:9002) di browser Anda.

## 📚 Dokumentasi

- [User Guide](docs/USER_GUIDE.md) - Panduan lengkap untuk pengguna
- [API Documentation](docs/API.md) - Dokumentasi API
- [Components](docs/COMPONENTS.md) - Dokumentasi komponen
- [Testing Guide](docs/TESTING.md) - Panduan testing

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) dengan App Router
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **AI/ML**: [Google Genkit](https://firebase.google.com/docs/genkit) dengan Gemini
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Maps**: [OpenLayers](https://openlayers.org/)
- **Language**: TypeScript

## 📦 Build untuk Production

```bash
# Build optimized production bundle
npm run build:prod

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🤝 Contributing

Kami menyambut kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan kontribusi.

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Tim

**Jejak Meong Team** - Dibuat dengan ❤️ untuk komunitas pecinta kucing Indonesia

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Framework React yang luar biasa
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Google AI](https://ai.google.dev/) - AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- Semua kontributor yang telah membantu proyek ini

## 📞 Kontak & Support

- 🐛 [Report Bug](https://github.com/yourusername/jejak-meong/issues)
- 💡 [Request Feature](https://github.com/yourusername/jejak-meong/issues)
- 📧 Email: support@jejakmeong.com
- 🌐 Website: [jejakmeong.com](https://jejakmeong.com)

---

<div align="center">

**Bantu kami menemukan kucing yang hilang! ⭐ Star repository ini jika Anda merasa terbantu**

Made with ❤️ in Indonesia 🇮🇩

</div>
