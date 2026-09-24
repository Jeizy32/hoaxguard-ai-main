import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  FileText,
  Eye
} from "lucide-react";

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

const AnalysisResults = ({ result }: { result: DetectionResult }) => {
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'real':
        return {
          icon: CheckCircle,
          title: 'Berita Terpercaya',
          description: 'Analisis menunjukkan berita ini kemungkinan besar akurat',
          color: 'success',
          bgGradient: 'bg-gradient-success'
        };
      case 'fake':
        return {
          icon: XCircle,
          title: 'Berita Hoax',
          description: 'Analisis menunjukkan berita ini kemungkinan besar palsu',
          color: 'destructive',
          bgGradient: 'bg-gradient-danger'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Berita Diragukan',
          description: 'Berita ini memerlukan verifikasi lebih lanjut',
          color: 'warning',
          bgGradient: 'bg-gradient-warning'
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;
  const confidencePercentage = Math.round(result.confidence);

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Result Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto p-4 rounded-full ${config.bgGradient}/20 mb-4`}>
              <Icon className={`h-12 w-12 text-${config.color}`} />
            </div>
            <CardTitle className="text-2xl font-bold">
              {config.title}
            </CardTitle>
            <p className="text-muted-foreground">
              {config.description}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {confidencePercentage}%
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tingkat Kepercayaan
              </p>
              <Progress 
                value={confidencePercentage} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analisis Sentimen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sentimen:</span>
                  <Badge variant="outline">{result.analysis.sentiment}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kredibilitas Sumber:</span>
                  <Badge variant="outline">{result.analysis.sourceCredibility}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-primary" />
                Kata Kunci Risiko
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.analysis.keywordsRisk.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.keywordsRisk.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="destructive"
                        className="text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tidak ditemukan kata kunci berisiko
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Linguistic Patterns */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Pola Linguistik Terdeteksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.analysis.linguisticPatterns.map((pattern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.verdict === 'fake' && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm">
                    <strong>⚠️ Hati-hati:</strong> Berita ini menunjukkan karakteristik hoax. 
                    Jangan membagikan tanpa verifikasi lebih lanjut dari sumber terpercaya.
                  </p>
                </div>
              )}
              
              {result.verdict === 'suspicious' && (
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm">
                    <strong>🔍 Verifikasi:</strong> Berita ini memerlukan pengecekan lebih lanjut. 
                    Cari sumber lain yang dapat memverifikasi informasi ini.
                  </p>
                </div>
              )}
              
              {result.verdict === 'real' && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm">
                    <strong>✅ Terpercaya:</strong> Berita ini menunjukkan karakteristik informasi yang kredibel.
                    Namun, tetap bijak dalam membagikan informasi.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AnalysisResults;