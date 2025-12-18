# Contributing to Jejak Meong

Terima kasih atas minat Anda untuk berkontribusi pada Jejak Meong! 🎉

## 🤝 Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buat [issue baru](https://github.com/yourusername/jejak-meong/issues) dengan informasi berikut:

- **Deskripsi bug** yang jelas dan ringkas
- **Langkah-langkah untuk mereproduksi**
- **Hasil yang diharapkan** vs **hasil aktual**
- **Screenshots** (jika applicable)
- **Environment**: Browser, OS, versi aplikasi

### Mengusulkan Fitur Baru

Kami terbuka untuk ide-ide baru! Untuk mengusulkan fitur:

1. Cek dulu apakah fitur tersebut sudah diusulkan di [issues](https://github.com/yourusername/jejak-meong/issues)
2. Buat issue baru dengan label `enhancement`
3. Jelaskan:
   - **Masalah** yang ingin diselesaikan
   - **Solusi** yang Anda usulkan
   - **Alternatif** yang sudah Anda pertimbangkan
   - **Mockup** atau contoh (jika ada)

### Pull Request Process

1. **Fork** repository ini
2. **Clone** fork Anda:
   ```bash
   git clone https://github.com/your-username/jejak-meong.git
   cd jejak-meong
   ```

3. **Buat branch** untuk fitur/fix Anda:
   ```bash
   git checkout -b feature/amazing-feature
   # atau
   git checkout -b fix/bug-description
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Buat perubahan** Anda dan pastikan:
   - Code mengikuti style guide yang ada
   - Menambahkan tests jika applicable
   - Update dokumentasi jika perlu
   - Commit messages yang jelas

6. **Test perubahan** Anda:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

7. **Commit** perubahan Anda:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

8. **Push** ke fork Anda:
   ```bash
   git push origin feature/amazing-feature
   ```

9. **Buat Pull Request** dari fork Anda ke repository utama

## 📝 Commit Message Guidelines

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Perubahan dokumentasi
- `style:` - Formatting, missing semicolons, etc
- `refactor:` - Code refactoring
- `test:` - Menambahkan tests
- `chore:` - Maintenance tasks

**Contoh:**
```
feat: add AI breed detection feature
fix: resolve map marker positioning issue
docs: update README with deployment instructions
```

## 🎨 Code Style

- Gunakan **TypeScript** untuk type safety
- Follow **ESLint** rules yang sudah dikonfigurasi
- Gunakan **Prettier** untuk formatting
- Komponen React menggunakan **function components** dengan hooks
- Gunakan **meaningful variable names**

## 🧪 Testing

Sebelum submit PR, pastikan:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## 📚 Development Setup

1. Setup environment variables (copy dari `.env.example` ke `.env.local`)
2. Setup Firebase project untuk development
3. Jalankan development server:
   ```bash
   npm run dev
   ```

## 🌍 Internationalization

Jika menambahkan text baru:
- Tambahkan ke `src/lib/translations.ts`
- Support Bahasa Indonesia dan English
- Gunakan `useLanguage()` hook untuk akses translations

## 🔒 Security

Jika menemukan security vulnerability:
- **JANGAN** buat public issue
- Email ke: security@jejakmeong.com
- Kami akan merespons dalam 48 jam

## 📄 License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License yang sama dengan project ini.

## ❓ Pertanyaan?

Jangan ragu untuk bertanya di:
- [GitHub Discussions](https://github.com/yourusername/jejak-meong/discussions)
- Email: support@jejakmeong.com

---

**Terima kasih telah berkontribusi! 🐱❤️**
