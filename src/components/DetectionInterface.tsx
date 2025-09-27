import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Link, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DetectionResult {
  confidence: number;
  verdict: 'real' | 'fake' | 'suspicious';
  analysis: {
    sentiment: string;
    keywordsRisk: string[];
    sourceCredibility: string;
    linguisticPatterns: string[];
    factCheck: {
      similarNews: Array<{
        title: string;
        source: string;
        credibility: 'high' | 'medium' | 'low';
        similarity: number;
        date: string;
        url?: string;
        summary?: string;
      }>;
      claimVerification: string[];
      expertOpinion: string;
    };
    technicalMetrics: {
      readabilityScore: number;
      emotionalIntensity: number;
      biasScore: number;
      factualDensity: number;
    };
    sourceAnalysis: {
      domainAge: string;
      authorCredibility: string;
      publicationHistory: string;
      socialMediaPresence: string;
    };
  };
}

const DetectionInterface = ({ 
  onAnalysisComplete 
}: { 
  onAnalysisComplete: (result: DetectionResult) => void;
}) => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const content = activeTab === 'text' ? text : url;
    
    if (!content.trim()) {
      toast({
        title: "Input diperlukan",
        description: "Mohon masukkan teks berita atau URL yang ingin dianalisis",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'url' && !content.startsWith('http')) {
      toast({
        title: "URL tidak valid",
        description: "Mohon masukkan URL yang valid (dimulai dengan http/https)",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let analyzeContent = content;
      
      // If URL is provided, we could fetch the content (simplified for demo)
      if (activeTab === 'url') {
        analyzeContent = `URL: ${url}\nContent analysis requested for: ${url}`;
      }

      console.log('Starting analysis with Perplexity API...');
      
      const { data, error } = await supabase.functions.invoke('analyze-news', {
        body: { 
          content: analyzeContent,
          url: activeTab === 'url' ? url : null
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to analyze content');
      }

      console.log('Analysis completed:', data);
      
      onAnalysisComplete(data);
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil deteksi hoax dari berita terkini telah tersedia.",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      
      toast({
        title: "Error Analisis",
        description: "Terjadi kesalahan saat menganalisis. Menggunakan data demo.",
        variant: "destructive",
      });

      // Fallback to mock data if API fails
      const fallbackResult = {
        confidence: Math.floor(Math.random() * 100) + 1, // Random 1-100
        verdict: 'suspicious' as const,
        analysis: {
          sentiment: 'Netral',
          keywordsRisk: ['memerlukan', 'verifikasi'],
          sourceCredibility: 'Sedang',
          linguisticPatterns: [
            'Konten memerlukan verifikasi lebih lanjut',
            'Crosscheck dengan sumber terpercaya direkomendasikan'
          ],
          factCheck: {
            similarNews: [],
            claimVerification: ['Analisis terganggu, gunakan sumber terpercaya untuk verifikasi'],
            expertOpinion: 'Silakan periksa kembali dengan sumber berita resmi dan terpercaya.'
          },
          technicalMetrics: {
            readabilityScore: 70,
            emotionalIntensity: 50,
            biasScore: 45,
            factualDensity: 65
          },
          sourceAnalysis: {
            domainAge: 'Tidak diketahui',
            authorCredibility: 'Tidak diketahui',
            publicationHistory: 'Tidak diketahui',
            socialMediaPresence: 'Tidak diketahui'
          }
        }
      };
      
      onAnalysisComplete(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="analisis" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-4">
              Analisis Berita Real-Time
            </CardTitle>
            <p className="text-muted-foreground">
              Masukkan teks berita atau URL artikel untuk dianalisis menggunakan AI dengan data berita terkini
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex border border-border/50 rounded-lg p-1 bg-muted/20">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                  activeTab === 'text' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="h-4 w-4" />
                Teks Berita
              </button>
              
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                  activeTab === 'url' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Link className="h-4 w-4" />
                URL Artikel
              </button>
            </div>
            
            {activeTab === 'text' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Teks Berita</label>
                <Textarea
                  placeholder="Paste teks berita yang ingin dianalisis di sini..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="resize-none bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  {text.length}/5000 karakter
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Artikel</label>
                <input
                  type="url"
                  placeholder="https://example.com/artikel-berita"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menganalisis dengan AI...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Analisis Sekarang
                </>
              )}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground">
              🚀 Menggunakan AI untuk menganalisis berita terkini dan mencari sumber serupa
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DetectionInterface;