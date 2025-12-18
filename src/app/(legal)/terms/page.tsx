import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Syarat & Ketentuan - Jejak Meong',
    description: 'Syarat dan ketentuan penggunaan layanan Jejak Meong',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Syarat & Ketentuan</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-sm text-muted-foreground mb-8">
                    Terakhir diperbarui: 18 Desember 2025
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Penerimaan Ketentuan</h2>
                    <p>
                        Dengan mengakses dan menggunakan layanan Jejak Meong ("Layanan"), Anda menyetujui untuk terikat oleh
                        Syarat dan Ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan Layanan kami.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Deskripsi Layanan</h2>
                    <p>
                        Jejak Meong adalah platform komunitas yang memfasilitasi pelaporan dan pencarian kucing yang hilang atau ditemukan.
                        Layanan ini mencakup:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Peta interaktif untuk melihat lokasi laporan</li>
                        <li>Fitur pelaporan kucing hilang atau ditemukan</li>
                        <li>Identifikasi ras kucing menggunakan AI</li>
                        <li>Sistem autentikasi pengguna</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Akun Pengguna</h2>
                    <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Registrasi</h3>
                    <p>
                        Untuk membuat laporan, Anda harus mendaftar menggunakan akun Google. Anda bertanggung jawab untuk
                        menjaga kerahasiaan akun Anda dan semua aktivitas yang terjadi di bawah akun Anda.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Informasi Akurat</h3>
                    <p>
                        Anda setuju untuk memberikan informasi yang akurat, terkini, dan lengkap selama proses registrasi
                        dan memperbarui informasi tersebut untuk menjaga keakuratannya.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Penggunaan Layanan</h2>
                    <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Penggunaan yang Diizinkan</h3>
                    <p>Anda setuju untuk menggunakan Layanan hanya untuk tujuan yang sah, termasuk:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Melaporkan kucing yang benar-benar hilang atau ditemukan</li>
                        <li>Membantu menemukan pemilik kucing yang hilang</li>
                        <li>Berkomunikasi dengan pengguna lain terkait laporan</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Penggunaan yang Dilarang</h3>
                    <p>Anda TIDAK diperbolehkan untuk:</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Membuat laporan palsu atau menyesatkan</li>
                        <li>Menggunakan Layanan untuk tujuan komersial tanpa izin</li>
                        <li>Mengunggah konten yang melanggar hukum, mengancam, atau tidak pantas</li>
                        <li>Melakukan spam atau penyalahgunaan sistem</li>
                        <li>Mencoba mengakses akun pengguna lain tanpa izin</li>
                        <li>Mengganggu atau merusak infrastruktur Layanan</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Konten Pengguna</h2>
                    <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Kepemilikan</h3>
                    <p>
                        Anda mempertahankan semua hak atas konten yang Anda unggah ke Layanan (foto, deskripsi, dll).
                        Namun, dengan mengunggah konten, Anda memberikan kami lisensi non-eksklusif, bebas royalti,
                        dan dapat dialihkan untuk menggunakan, mereproduksi, dan menampilkan konten tersebut dalam
                        rangka menyediakan Layanan.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Tanggung Jawab Konten</h3>
                    <p>
                        Anda bertanggung jawab penuh atas konten yang Anda unggah. Kami berhak untuk menghapus konten
                        yang melanggar ketentuan ini atau hukum yang berlaku tanpa pemberitahuan sebelumnya.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Fitur AI</h2>
                    <p>
                        Layanan kami menyediakan fitur identifikasi ras kucing menggunakan AI. Anda memahami dan menyetujui bahwa:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Hasil AI adalah prediksi dan bukan diagnosis pasti</li>
                        <li>Akurasi dapat bervariasi tergantung kualitas foto dan ras kucing</li>
                        <li>Kami tidak bertanggung jawab atas keputusan yang dibuat berdasarkan hasil AI</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Privasi</h2>
                    <p>
                        Penggunaan Layanan kami juga diatur oleh{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                            Kebijakan Privasi
                        </a>{' '}
                        kami. Dengan menggunakan Layanan, Anda menyetujui pengumpulan dan penggunaan informasi
                        sesuai dengan Kebijakan Privasi kami.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">8. Batasan Tanggung Jawab</h2>
                    <p>
                        Jejak Meong adalah platform yang memfasilitasi komunikasi antar pengguna. Kami TIDAK:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Menjamin keakuratan informasi yang diposting pengguna</li>
                        <li>Bertanggung jawab atas interaksi antara pengguna</li>
                        <li>Menjamin bahwa kucing yang hilang akan ditemukan</li>
                        <li>Bertanggung jawab atas kerugian atau kerusakan yang timbul dari penggunaan Layanan</li>
                    </ul>
                    <p className="mt-4">
                        LAYANAN DISEDIAKAN "SEBAGAIMANA ADANYA" TANPA JAMINAN APAPUN, BAIK TERSURAT MAUPUN TERSIRAT.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">9. Penghentian Akun</h2>
                    <p>
                        Kami berhak untuk menangguhkan atau menghentikan akun Anda jika:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>Anda melanggar Syarat dan Ketentuan ini</li>
                        <li>Kami mencurigai aktivitas penipuan atau penyalahgunaan</li>
                        <li>Diperlukan oleh hukum atau otoritas yang berwenang</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">10. Perubahan Ketentuan</h2>
                    <p>
                        Kami berhak untuk mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan efektif
                        setelah diposting di halaman ini. Penggunaan Layanan yang berkelanjutan setelah perubahan
                        berarti Anda menyetujui ketentuan yang diperbarui.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">11. Hukum yang Berlaku</h2>
                    <p>
                        Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
                        Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">12. Kontak</h2>
                    <p>
                        Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di:
                    </p>
                    <ul className="list-none mt-2">
                        <li>Email: legal@jejakmeong.com</li>
                        <li>Website: <a href="/" className="text-primary hover:underline">jejakmeong.com</a></li>
                    </ul>
                </section>

                <div className="mt-12 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                        Dengan menggunakan Jejak Meong, Anda mengakui bahwa Anda telah membaca, memahami,
                        dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini.
                    </p>
                </div>
            </div>
        </div>
    );
}
