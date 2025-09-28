# Jejak Meong

Jejak Meong adalah aplikasi web untuk membantu menemukan dan melaporkan kucing yang hilang atau ditemukan di sekitar Anda. Aplikasi ini menampilkan laporan pada peta interaktif dan juga dalam format daftar, memudahkan komunitas untuk saling membantu menemukan kembali teman berbulu mereka.

## Fitur Utama

- **Peta Interaktif:** Lihat laporan kucing yang hilang atau ditemukan berdasarkan lokasi geografis mereka menggunakan OpenLayers.
- **Tampilan Daftar:** Jelajahi semua laporan dalam format kartu yang mudah dibaca.
- **Pelaporan Kucing:** Pengguna yang sudah login dapat melaporkan kucing baru dengan detail seperti nama, jenis kelamin, foto, dan lokasi terakhir terlihat.
- **Login dengan Google:** Sistem autentikasi yang aman menggunakan Firebase Authentication.
- **Saran Ras Berbasis AI:** Unggah foto kucing dan dapatkan saran ras menggunakan Google AI (Gemini) melalui Genkit.
- **Dukungan Multibahasa:** Antarmuka tersedia dalam Bahasa Indonesia (default) dan Inggris.
- **Mode Gelap/Terang:** Tombol untuk mengganti tema sesuai preferensi pengguna.
- **Desain Responsif:** Tampilan yang optimal di perangkat desktop maupun mobile.

## Teknologi yang Digunakan

- **Framework:** [Next.js](https://nextjs.org/) (dengan App Router)
- **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Autentikasi:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **AI/Generative:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Komponen UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Peta:** [OpenLayers](https://openlayers.org/)
- **Bahasa:** TypeScript

## Pengaturan & Menjalankan Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori:**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd <NAMA_DIREKTORI>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Siapkan Environment Variables:**
    Buat file baru bernama `.env.local` di direktori root proyek Anda. Salin konten dari file `.env` (jika ada) atau mulai dari awal. Anda perlu menambahkan konfigurasi Firebase Anda ke file ini. Anda bisa mendapatkan nilai-nilai ini dari Firebase Console.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=AIz...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...

    # Diperlukan untuk fitur AI (saran ras)
    GEMINI_API_KEY=AIz...
    ```

4.  **Jalankan Aplikasi:**
    ```bash
    npm run dev
    ```

    Aplikasi sekarang akan berjalan di `http://localhost:9002`.
