# Firebase Rules Deployment

File ini berisi instruksi untuk deploy Firebase Security Rules ke Firebase Console.

## Files

- `firestore.rules` - Firestore Database Security Rules
- `storage.rules` - Firebase Storage Security Rules

## Deployment

### Option 1: Manual Deployment via Firebase Console

#### Firestore Rules
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Navigasi ke **Firestore Database** > **Rules**
4. Copy isi file `firestore.rules` dan paste ke editor
5. Klik **Publish**

#### Storage Rules
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Navigasi ke **Storage** > **Rules**
4. Copy isi file `storage.rules` dan paste ke editor
5. Klik **Publish**

### Option 2: Deployment via Firebase CLI

```bash
# Install Firebase CLI (jika belum)
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Deploy Firestore Rules
firebase deploy --only firestore:rules

# Deploy Storage Rules
firebase deploy --only storage:rules

# Deploy semua rules sekaligus
firebase deploy --only firestore:rules,storage:rules
```

## Security Rules Summary

### Firestore Rules
- ✅ **Read**: Public (semua orang bisa membaca data kucing)
- ✅ **Create**: Public dengan validasi data yang ketat
- 🔒 **Update/Delete**: Memerlukan autentikasi (untuk future features)
- ✅ **Validasi**: Name, gender, type, breed, location, timestamps
- ✅ **Image URLs**: Mendukung single imageUrl dan multiple imageUrls (max 5)

### Storage Rules
- ✅ **Read**: Public (semua orang bisa melihat gambar)
- ✅ **Upload**: Public dengan validasi:
  - Hanya file image (`image/*`)
  - Maksimal 5MB per file
- 🔒 **Update/Delete**: Memerlukan autentikasi (untuk future features)
- ✅ **Path Structure**: `/cats/{catId}/{imageId}`

## Testing Rules

Setelah deploy, test rules dengan:

1. **Test Upload Gambar**:
   - Upload gambar via aplikasi
   - Verifikasi gambar tersimpan di Storage Console
   - Verifikasi URL tersimpan di Firestore

2. **Test Validasi**:
   - Coba upload file non-image (harus ditolak)
   - Coba upload file > 5MB (harus ditolak)
   - Coba submit form tanpa required fields (harus ditolak)

3. **Test Read Access**:
   - Buka aplikasi tanpa login
   - Verifikasi bisa melihat data dan gambar kucing

## Notes

- Rules ini dirancang untuk aplikasi public reporting
- Authentication akan diperlukan untuk fitur update/delete di masa depan
- Temporary uploads folder (`/temp`) memiliki full access untuk testing
