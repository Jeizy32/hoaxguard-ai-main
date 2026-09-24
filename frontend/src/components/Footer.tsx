import { Shield, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-300 py-12 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Kolom 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">HoaxGuard</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Melindungi masyarakat dari misinformasi dengan teknologi AI terdepan.
            </p>
          </div>

          {/* Kolom 2: Produk */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-3 text-sm">
              <li>
                {/* Link ini akan otomatis scroll ke kotak input analisis */}
                <a href="#analisis" className="hover:text-blue-400 transition-colors">
                  Deteksi Teks
                </a>
              </li>
              <li>
                <span className="flex items-center text-slate-500 cursor-not-allowed">
                  Analisis URL
                  <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded ml-2 whitespace-nowrap border border-blue-500/20">
                    Segera Hadir
                  </span>
                </span>
              </li>
              <li>
                <span className="flex items-center text-slate-500 cursor-not-allowed">
                  API Integration
                  <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded ml-2 whitespace-nowrap border border-blue-500/20">
                    Segera Hadir
                  </span>
                </span>
              </li>
              <li>
                <span className="flex items-center text-slate-500 cursor-not-allowed">
                  Laporan Batch
                  <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded ml-2 whitespace-nowrap border border-blue-500/20">
                    Segera Hadir
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Dukungan */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://github.com/Jeizy32/hoaxguard-ai-main#readme" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  Dokumentasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="mailto:rijalrodriguez32@gmail.com" className="hover:text-blue-400 transition-colors">Kontak</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Status API</a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Komunitas */}
          <div>
            <h3 className="text-white font-semibold mb-4">Komunitas</h3>
            <div className="flex gap-3 mb-4">
              <a 
                href="https://github.com/Jeizy32/hoaxguard-ai-main" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:rijalrodriguez32@gmail.com" 
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-blue-500/50 hover:text-blue-400 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bergabung dengan ribuan pengguna yang mempercayai HoaxGuard.
            </p>
          </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="border-t border-slate-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 HoaxGuard. Semua hak dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;