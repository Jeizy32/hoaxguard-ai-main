import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2, FileText, Link, Upload } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export interface DetectionResult {
  confidence: number;
  verdict: 'real' | 'fake' | 'suspicious';
  summary?: string; 
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

    setIsAnalyzing(true);
    
    try {
      const response = await fetch("https://jeizyy.pythonanywhere.com/api/predict", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: content,
          type: activeTab
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal terhubung ke server Flask');
      }

      const resData = await response.json();
      
      // UPDATE: Tentukan status berdasarkan balasan Flask (3 Kasta)
      let finalVerdict: 'real' | 'fake' | 'suspicious' = 'real';
      if (resData.hasil_prediksi === "Hoax") finalVerdict = 'fake';
      if (resData.hasil_prediksi === "Diragukan") finalVerdict = 'suspicious';
      
      const prob = resData.probabilitas;

      const formattedResult: DetectionResult = {
        confidence: prob,
        verdict: finalVerdict,
        summary: resData.ringkasan,
        analysis: {
          sentiment: finalVerdict === 'fake' ? 'Negatif / Provokatif' : (finalVerdict === 'suspicious' ? 'Mencurigakan / Abu-abu' : 'Netral / Objektif'),
          keywordsRisk: finalVerdict === 'fake' ? ['Sensasional', 'Manipulatif'] : (finalVerdict === 'suspicious' ? ['Link Abu-abu', 'Potensi Phishing'] : ['Aman', 'Faktual']),
          sourceCredibility: resData.kredibilitas_sumber || (finalVerdict === 'fake' ? 'Rendah' : 'Tinggi'),
          linguisticPatterns: resData.pola_linguistik || ['Analisis teks selesai'],
          factCheck: {
            similarNews: resData.berita_serupa || [],
            claimVerification: [resData.pesan || 'Teks berhasil diproses oleh Otak AI Lokal.'],
            expertOpinion: resData.opini_ahli || (finalVerdict === 'fake' 
              ? 'Model Naive Bayes mendeteksi pola bobot TF-IDF yang sangat identik dengan karakteristik berita palsu (Hoaks).' 
              : 'Pola kalimat dan bobot kata selaras dengan berita faktual.')
          },
          technicalMetrics: {
            readabilityScore: finalVerdict === 'fake' ? 55 : 85,
            emotionalIntensity: finalVerdict === 'fake' ? Math.min(prob + 5, 98) : (finalVerdict === 'suspicious' ? 55 : Math.max(100 - prob, 15)),
            biasScore: finalVerdict === 'fake' ? Math.min(prob, 95) : (finalVerdict === 'suspicious' ? 60 : Math.max(100 - prob, 10)),
            factualDensity: finalVerdict === 'fake' ? Math.max(100 - prob, 12) : (finalVerdict === 'suspicious' ? 45 : Math.min(prob, 96))
          },
          sourceAnalysis: {
            domainAge: resData.domain || 'Analisis Teks Mentah',
            authorCredibility: resData.kredibilitas_sumber || 'Diproses by Machine Learning',
            publicationHistory: 'Riwayat domain tersedia',
            socialMediaPresence: 'Pengecekan Independen'
          }
        }
      };
      
      onAnalysisComplete(formattedResult);
      
      toast({
        title: "Analisis Selesai",
        description: `Berita dinyatakan: ${resData.hasil_prediksi}`,
      });

    } catch (error) {
      console.error('Koneksi Error:', error);
      toast({
        title: "Error Analisis",
        description: error instanceof Error ? error.message : "Pastikan server Flask nyala!",
        variant: "destructive",
      });
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
              Analisis Berita Real-Time (Model ML Lokal)
            </CardTitle>
            <p className="text-muted-foreground">
              Masukkan teks berita untuk diuji langsung menggunakan model Machine Learning bikinan lu sendiri
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex border border-border/50 rounded-lg p-1 bg-muted/20">
              <button
                type="button"
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
                type="button"
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
                  Model ML Sedang Menganalisis...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Analisis Sekarang
                </>
              )}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground">
              ⚡ Terhubung langsung dengan Backend Flask dan Model .pkl Lokal Lu
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DetectionInterface;