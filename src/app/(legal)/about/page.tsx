import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tentang Kami - Jejak Meong',
    description: 'Tentang platform Jejak Meong dan misi kami',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Tentang Jejak Meong</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
                    <p className="text-lg">
                        Jejak Meong hadir untuk membantu komunitas pecinta kucing di Indonesia menemukan kembali
                        teman berbulu mereka yang hilang. Kami percaya bahwa dengan teknologi dan kekuatan komunitas,
                        setiap kucing yang hilang memiliki peluang lebih besar untuk pulang.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Visi Kami</h2>
                    <p>
                        Menjadi platform terdepan di Indonesia untuk reunifikasi kucing yang hilang dengan pemiliknya,
                        menciptakan komunitas yang peduli dan responsif terhadap kesejahteraan hewan.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Cerita Kami</h2>
                    <p>
                        Jejak Meong dimulai dari pengalaman pribadi kehilangan kucing kesayangan. Kami menyadari
                        betapa sulitnya mencari kucing yang hilang tanpa sistem yang terorganisir. Dari situ lahirlah
                        ide untuk membuat platform yang memudahkan pemilik kucing untuk melaporkan dan mencari
                        kucing mereka yang hilang.
                    </p>
                    <p className="mt-4">
                        Dengan memanfaatkan teknologi peta interaktif dan kecerdasan buatan, kami menciptakan
                        solusi yang tidak hanya mudah digunakan, tetapi juga efektif dalam membantu reunifikasi
                        kucing dengan pemiliknya.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Fitur Unggulan</h2>
                    <div className="grid gap-4 mt-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">🗺️ Peta Interaktif</h3>
                            <p>
                                Visualisasi lokasi laporan kucing hilang dan ditemukan dalam peta yang mudah dinavigasi,
                                membantu Anda menemukan kucing di area terdekat.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">🤖 AI Breed Detection</h3>
                            <p>
                                Teknologi kecerdasan buatan Google Gemini membantu mengidentifikasi ras kucing dari foto,
                                mempermudah pencarian dengan deskripsi yang lebih akurat.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">📱 Mobile-Friendly</h3>
                            <p>
                                Desain responsif yang optimal di semua perangkat, memungkinkan Anda melaporkan dan
                                mencari kucing kapan saja, di mana saja.
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">🔐 Aman & Terpercaya</h3>
                            <p>
                                Autentikasi dengan Google dan enkripsi data memastikan keamanan informasi Anda dan
                                integritas platform.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Teknologi yang Kami Gunakan</h2>
                    <p>
                        Jejak Meong dibangun dengan teknologi modern dan terpercaya:
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Next.js 15</strong> - Framework React untuk performa optimal</li>
                        <li><strong>Firebase</strong> - Database real-time dan autentikasi yang aman</li>
                        <li><strong>Google AI (Gemini)</strong> - Kecerdasan buatan untuk identifikasi ras</li>
                        <li><strong>OpenLayers</strong> - Peta interaktif yang powerful</li>
                        <li><strong>TypeScript</strong> - Kode yang type-safe dan maintainable</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Komitmen Kami</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">🌟 Gratis untuk Semua</h3>
                            <p>
                                Kami percaya bahwa setiap kucing berhak untuk pulang. Layanan kami gratis dan akan
                                tetap gratis untuk membantu sebanyak mungkin kucing reunifikasi dengan pemiliknya.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">🔒 Privacy First</h3>
                            <p>
                                Kami menghormati privasi Anda. Data pribadi Anda dilindungi sesuai dengan standar
                                internasional dan hanya digunakan untuk tujuan layanan.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">🤝 Community Driven</h3>
                            <p>
                                Platform ini dibangun untuk dan oleh komunitas. Kami terbuka untuk feedback dan
                                terus berkembang berdasarkan kebutuhan pengguna.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">🌱 Berkelanjutan</h3>
                            <p>
                                Kami berkomitmen untuk menjaga platform ini tetap aktif dan terus berkembang,
                                memastikan layanan yang reliable untuk jangka panjang.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Statistik</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold text-primary">1000+</div>
                            <div className="text-sm text-muted-foreground mt-1">Laporan Aktif</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold text-primary">500+</div>
                            <div className="text-sm text-muted-foreground mt-1">Kucing Ditemukan</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold text-primary">2000+</div>
                            <div className="text-sm text-muted-foreground mt-1">Pengguna Aktif</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-3xl font-bold text-primary">95%</div>
                            <div className="text-sm text-muted-foreground mt-1">Tingkat Kepuasan</div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                        * Statistik diperbarui secara berkala
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Hubungi Kami</h2>
                    <p>
                        Kami senang mendengar dari Anda! Jangan ragu untuk menghubungi kami untuk pertanyaan,
                        saran, atau kerjasama.
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Email:</span>
                            <a href="mailto:support@jejakmeong.com" className="text-primary hover:underline">
                                support@jejakmeong.com
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Website:</span>
                            <a href="/" className="text-primary hover:underline">
                                jejakmeong.com
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">GitHub:</span>
                            <a
                                href="https://github.com/yourusername/jejak-meong"
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                github.com/yourusername/jejak-meong
                            </a>
                        </div>
                    </div>
                </section>

                <div className="mt-12 p-6 bg-primary/10 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-4">Bergabunglah dengan Misi Kami</h3>
                    <p className="mb-4">
                        Setiap laporan yang Anda buat, setiap kucing yang Anda bantu temukan, membuat perbedaan.
                        Mari bersama-sama membantu lebih banyak kucing menemukan jalan pulang.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Mulai Sekarang
                    </a>
                </div>
            </div>
        </div>
    );
}
