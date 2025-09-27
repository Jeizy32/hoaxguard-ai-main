import { Shield, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">HoaxGuard</h3>
                <p className="text-xs text-muted-foreground">AI Hoax Detection</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Melindungi masyarakat dari misinformasi dengan teknologi AI terdepan.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Deteksi Teks</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analisis URL</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Integration</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Laporan Batch</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Dokumentasi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Komunitas</h4>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-muted/20 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted/20 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-muted/20 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Bergabung dengan ribuan pengguna yang mempercayai HoaxGuard.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 HoaxGuard. Semua hak dilindungi. 
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;