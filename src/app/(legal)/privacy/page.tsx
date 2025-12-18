import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kebijakan Privasi - Jejak Meong',
    description: 'Kebijakan privasi dan perlindungan data Jejak Meong',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Kebijakan Privasi</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-sm text-muted-foreground mb-8">
                    Terakhir diperbarui: 18 Desember 2025
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Pendahuluan</h2>
                    <p>
                        Jejak Meong ("kami", "kita", atau "milik kami") berkomitmen untuk melindungi privasi Anda.
                        Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi
                        informasi pribadi Anda saat menggunakan layanan kami.
                    </p>
                    <p className="mt-4">
                        Kebijakan ini sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) Indonesia
                        dan General Data Protection Regulation (GDPR) untuk pengguna di Uni Eropa.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Informasi yang Kami Kumpulkan</h2>

                    <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Informasi yang Anda Berikan</h3>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Informasi Akun</strong>: Nama, email, dan foto profil dari akun Google Anda</li>
                        <li><strong>Laporan Kucing</strong>: Foto kucing, deskripsi, lokasi, informasi kontak</li>
                        <li><strong>Komunikasi</strong>: Pesan atau feedback yang Anda kirimkan kepada kami</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Informasi yang Dikumpulkan Otomatis</h3>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Data Penggunaan</strong>: Halaman yang dikunjungi, waktu akses, durasi sesi</li>
                        <li><strong>Data Perangkat</strong>: Jenis browser, sistem operasi, alamat IP</li>
                        <li><strong>Data Lokasi</strong>: Lokasi geografis (hanya saat Anda membuat laporan)</li>
                        <li><strong>Cookies</strong>: Informasi yang disimpan di browser Anda (lihat bagian Cookies)</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Informasi dari Pihak Ketiga</h3>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Google Authentication</strong>: Informasi profil dasar dari Google</li>
                        <li><strong>Google AI</strong>: Data gambar yang diproses untuk identifikasi ras kucing</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Cara Kami Menggunakan Informasi</h2>
                    <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Menyediakan dan memelihara layanan kami</li>
                        <li>Menampilkan laporan kucing di peta dan daftar</li>
                        <li>Memfasilitasi komunikasi antar pengguna</li>
                        <li>Meningkatkan dan mengoptimalkan layanan kami</li>
                        <li>Mengirim notifikasi terkait layanan (jika diaktifkan)</li>
                        <li>Menganalisis penggunaan layanan untuk perbaikan</li>
                        <li>Mencegah penipuan dan penyalahgunaan</li>
                        <li>Mematuhi kewajiban hukum</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Dasar Hukum Pemrosesan Data</h2>
                    <p>Kami memproses data pribadi Anda berdasarkan:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Persetujuan</strong>: Anda memberikan persetujuan untuk pemrosesan data tertentu</li>
                        <li><strong>Pelaksanaan Kontrak</strong>: Diperlukan untuk menyediakan layanan yang Anda minta</li>
                        <li><strong>Kepentingan Sah</strong>: Untuk meningkatkan layanan dan mencegah penyalahgunaan</li>
                        <li><strong>Kewajiban Hukum</strong>: Untuk mematuhi hukum yang berlaku</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Berbagi Informasi</h2>
                    <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Informasi Publik</h3>
                    <p>
                        Laporan kucing yang Anda buat (termasuk foto, deskripsi, lokasi, dan informasi kontak)
                        akan <strong>dipublikasikan secara terbuka</strong> dan dapat dilihat oleh semua pengguna.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Pihak Ketiga</h3>
                    <p>Kami dapat membagikan informasi dengan:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Firebase/Google Cloud</strong>: Untuk hosting dan database</li>
                        <li><strong>Google AI</strong>: Untuk pemrosesan gambar (identifikasi ras)</li>
                        <li><strong>Penyedia Layanan</strong>: Untuk analytics, monitoring, dan email</li>
                    </ul>
                    <p className="mt-4">
                        Kami TIDAK menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Cookies dan Teknologi Pelacakan</h2>
                    <p>Kami menggunakan cookies dan teknologi serupa untuk:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Menjaga sesi login Anda</li>
                        <li>Mengingat preferensi Anda (tema, bahasa)</li>
                        <li>Menganalisis penggunaan layanan</li>
                        <li>Meningkatkan keamanan</li>
                    </ul>
                    <p className="mt-4">
                        Anda dapat mengontrol cookies melalui pengaturan browser Anda. Namun, menonaktifkan cookies
                        dapat mempengaruhi fungsionalitas layanan.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Keamanan Data</h2>
                    <p>
                        Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi
                        data pribadi Anda, termasuk:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Enkripsi data saat transit (HTTPS/SSL)</li>
                        <li>Enkripsi data saat disimpan di Firebase</li>
                        <li>Autentikasi dan otorisasi yang ketat</li>
                        <li>Monitoring dan logging aktivitas sistem</li>
                        <li>Backup data secara berkala</li>
                    </ul>
                    <p className="mt-4">
                        Namun, tidak ada metode transmisi atau penyimpanan data yang 100% aman. Kami tidak dapat
                        menjamin keamanan absolut.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">8. Retensi Data</h2>
                    <p>
                        Kami menyimpan data pribadi Anda selama:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Akun Anda aktif</li>
                        <li>Diperlukan untuk menyediakan layanan</li>
                        <li>Diperlukan untuk mematuhi kewajiban hukum</li>
                        <li>Diperlukan untuk menyelesaikan sengketa</li>
                    </ul>
                    <p className="mt-4">
                        Laporan kucing akan tetap tersimpan hingga Anda menghapusnya secara manual.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">9. Hak Anda</h2>
                    <p>Sesuai dengan UU PDP dan GDPR, Anda memiliki hak untuk:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Akses</strong>: Meminta salinan data pribadi Anda</li>
                        <li><strong>Perbaikan</strong>: Meminta koreksi data yang tidak akurat</li>
                        <li><strong>Penghapusan</strong>: Meminta penghapusan data Anda ("right to be forgotten")</li>
                        <li><strong>Pembatasan</strong>: Meminta pembatasan pemrosesan data</li>
                        <li><strong>Portabilitas</strong>: Meminta transfer data ke layanan lain</li>
                        <li><strong>Keberatan</strong>: Menolak pemrosesan data tertentu</li>
                        <li><strong>Penarikan Persetujuan</strong>: Menarik persetujuan yang telah diberikan</li>
                    </ul>
                    <p className="mt-4">
                        Untuk menggunakan hak-hak ini, silakan hubungi kami di privacy@jejakmeong.com
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">10. Anak-anak</h2>
                    <p>
                        Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak secara sengaja
                        mengumpulkan informasi pribadi dari anak-anak. Jika Anda mengetahui bahwa anak Anda telah
                        memberikan informasi pribadi kepada kami, silakan hubungi kami.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">11. Transfer Data Internasional</h2>
                    <p>
                        Data Anda mungkin diproses di server yang berlokasi di luar Indonesia (Firebase/Google Cloud).
                        Kami memastikan bahwa transfer data dilakukan sesuai dengan standar perlindungan data yang berlaku.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">12. Perubahan Kebijakan Privasi</h2>
                    <p>
                        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting
                        di halaman ini dengan tanggal "Terakhir diperbarui" yang baru. Kami mendorong Anda untuk
                        meninjau kebijakan ini secara berkala.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">13. Kontak</h2>
                    <p>
                        Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak-hak Anda:
                    </p>
                    <ul className="list-none mt-2">
                        <li>Email: privacy@jejakmeong.com</li>
                        <li>Data Protection Officer: dpo@jejakmeong.com</li>
                        <li>Website: <a href="/" className="text-primary hover:underline">jejakmeong.com</a></li>
                    </ul>
                </section>

                <div className="mt-12 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                        <strong>Persetujuan:</strong> Dengan menggunakan Jejak Meong, Anda menyetujui pengumpulan
                        dan penggunaan informasi sesuai dengan Kebijakan Privasi ini.
                    </p>
                </div>
            </div>
        </div>
    );
}
