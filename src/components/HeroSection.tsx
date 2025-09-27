import { Button } from "@/components/ui/button";
import { Shield, Search, CheckCircle, AlertTriangle } from "lucide-react";

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/20 rounded-full animate-pulse-glow">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-fade-in">
          HoaxGuard AI
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
          Deteksi berita hoax dengan akurasi tinggi menggunakan teknologi <span className="text-primary font-semibold">Machine Learning</span> terdepan
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <Search className="mr-2 h-5 w-5" />
            Mulai Analisis
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-card animate-fade-in">
            <CheckCircle className="h-8 w-8 text-success mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Akurasi Tinggi</h3>
            <p className="text-sm text-muted-foreground">Model AI dengan tingkat akurasi 95%+ dalam mendeteksi berita palsu</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-card animate-fade-in">
            <AlertTriangle className="h-8 w-8 text-warning mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Analisis Real-time</h3>
            <p className="text-sm text-muted-foreground">Hasil instan dengan analisis mendalam terhadap konten berita</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-card animate-fade-in">
            <Shield className="h-8 w-8 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Verifikasi Sumber</h3>
            <p className="text-sm text-muted-foreground">Validasi kredibilitas sumber dan cross-referencing otomatis</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;