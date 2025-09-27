import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HoaxGuard</h1>
              <p className="text-xs text-muted-foreground">AI Hoax Detection</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#beranda" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </a>
            <a href="#cara-kerja" className="text-muted-foreground hover:text-primary transition-colors">
              Cara Kerja
            </a>
            <a href="#analisis" className="text-muted-foreground hover:text-primary transition-colors">
              Analisis
            </a>
            <Button variant="outline" size="sm" className="border-primary/30">
              Kontak
            </Button>
          </nav>
          
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;