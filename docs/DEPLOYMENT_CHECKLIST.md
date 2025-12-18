# 🚀 Deployment Checklist - Jejak Meong

Checklist lengkap untuk memastikan deployment production berjalan lancar dan aman.

## Pre-Deployment Checklist

### 1. Environment Variables ✅
- [ ] Semua environment variables production sudah diset di Vercel/hosting
- [ ] Firebase production config sudah benar
- [ ] Google AI API key production sudah aktif
- [ ] Google Analytics measurement ID sudah diset (opsional)
- [ ] Sentry DSN sudah diset (opsional)
- [ ] Email API key sudah diset (opsional)

### 2. Firebase Configuration 🔥
- [ ] Firebase project production sudah dibuat
- [ ] Firestore database sudah disetup
- [ ] Firebase Storage sudah diaktifkan
- [ ] Firebase Authentication (Google provider) sudah diaktifkan
- [ ] Firestore Security Rules sudah di-deploy
- [ ] Storage Security Rules sudah di-deploy
- [ ] Firebase Analytics sudah diaktifkan (opsional)

### 3. Code Quality 🧪
- [ ] `npm run typecheck` berhasil tanpa error
- [ ] `npm run lint` berhasil tanpa error
- [ ] `npm run build:prod` berhasil
- [ ] Tidak ada console.log yang tersisa di production code
- [ ] Tidak ada TODO yang critical

### 4. Security 🔒
- [ ] Semua API keys disimpan di environment variables (tidak hardcoded)
- [ ] CSP headers sudah dikonfigurasi di next.config.ts
- [ ] Firebase rules sudah di-audit dan di-test
- [ ] Rate limiting sudah diimplementasi (jika ada)
- [ ] HTTPS sudah aktif

### 5. Performance ⚡
- [ ] Images sudah dioptimasi
- [ ] Bundle size sudah dicek (npm run analyze)
- [ ] Lighthouse score minimal 90 untuk Performance
- [ ] Core Web Vitals dalam threshold

### 6. Legal & Compliance ⚖️
- [ ] Terms of Service sudah review dan publish
- [ ] Privacy Policy sudah review dan publish
- [ ] Cookie consent banner sudah berfungsi
- [ ] About page sudah lengkap

### 7. Content 📝
- [ ] README.md sudah update dengan production URL
- [ ] User Guide sudah lengkap
- [ ] Contact information sudah benar
- [ ] Social media links sudah benar (jika ada)

## Deployment Steps

### 1. Vercel Deployment

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod
```

### 2. Set Environment Variables di Vercel

```bash
# Via CLI
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add GOOGLE_GENAI_API_KEY production
# ... dst untuk semua env variables

# Atau via Vercel Dashboard:
# 1. Buka project di dashboard.vercel.com
# 2. Settings > Environment Variables
# 3. Tambahkan semua variables dari .env.example
```

### 3. Deploy Firebase Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

### 4. Verify Deployment

- [ ] Website bisa diakses di production URL
- [ ] Login dengan Google berfungsi
- [ ] Bisa membuat laporan baru
- [ ] Peta menampilkan laporan dengan benar
- [ ] AI breed detection berfungsi
- [ ] Dark mode berfungsi
- [ ] Mobile responsive
- [ ] Cookie consent muncul untuk user baru

## Post-Deployment Checklist

### 1. Monitoring 📊
- [ ] Setup Vercel Analytics
- [ ] Setup Google Analytics (jika diaktifkan)
- [ ] Setup Sentry error tracking (jika diaktifkan)
- [ ] Monitor Firebase usage metrics

### 2. SEO 🔍
- [ ] Submit sitemap ke Google Search Console
- [ ] Verify site ownership di Google Search Console
- [ ] Test social sharing preview (Facebook, Twitter)
- [ ] Test structured data dengan Rich Results Test

### 3. Performance Testing ⚡
- [ ] Run Lighthouse audit
- [ ] Test loading speed dari berbagai lokasi
- [ ] Test di berbagai devices (mobile, tablet, desktop)
- [ ] Test di berbagai browsers (Chrome, Firefox, Safari, Edge)

### 4. Security Testing 🔒
- [ ] Run security scan (npm audit)
- [ ] Test Firebase rules dengan Firebase Emulator
- [ ] Verify HTTPS redirect
- [ ] Test CSP headers

### 5. User Acceptance Testing 👥
- [ ] Test dengan 5-10 beta users
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Update documentation based on feedback

## Rollback Procedure

Jika terjadi masalah serius:

### Via Vercel Dashboard
1. Buka project di dashboard.vercel.com
2. Pilih tab "Deployments"
3. Cari deployment sebelumnya yang stabil
4. Klik "..." > "Promote to Production"

### Via Vercel CLI
```bash
# List deployments
vercel ls

# Rollback ke deployment sebelumnya
vercel rollback [deployment-url]
```

## Emergency Contacts

- **Technical Lead**: your-email@example.com
- **Firebase Support**: https://firebase.google.com/support
- **Vercel Support**: https://vercel.com/support
- **Sentry Support**: https://sentry.io/support (jika digunakan)

## Post-Launch Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Monitor user feedback
- [ ] Fix critical bugs immediately
- [ ] Update documentation based on user questions

### Week 2-4
- [ ] Analyze user behavior dengan Analytics
- [ ] Optimize based on performance metrics
- [ ] Plan feature improvements
- [ ] Collect user testimonials

### Monthly
- [ ] Review Firebase usage dan costs
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Backup Firestore data

## Notes

- Simpan semua credentials di password manager yang aman
- Dokumentasikan setiap perubahan configuration
- Maintain changelog untuk tracking updates
- Backup database sebelum major updates

---

**Last Updated**: 18 Desember 2025
**Version**: 1.0.0
