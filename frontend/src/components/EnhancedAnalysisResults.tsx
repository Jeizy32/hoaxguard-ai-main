import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";
import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  FileText,
  Eye,
  ExternalLink,
  BarChart3,
  Globe,
  Calendar,
  Star,
  Activity,
  Users,
  Search,
  ChevronDown,
  Copy,
  Info,
  Maximize2
} from "lucide-react";

interface DetectionResult {
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

const EnhancedAnalysisResults = ({ result }: { result: DetectionResult }) => {

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: `${type} berhasil disalin ke clipboard`,
    });
  };
  
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'real': {
        // Cek apakah ini artikel klarifikasi berdasarkan opini ahli dari Flask
        const isClarification = result.analysis.factCheck.expertOpinion.toLowerCase().includes('klarifikasi');

        if (isClarification) {
          return {
            icon: Shield,
            title: 'Artikel Klarifikasi (Anti-Hoaks)',
            description: (
              <span className="text-base">
                <span className="text-success font-bold">SUMBER BERITA ASLI</span>, namun sedang membahas/membongkar <span className="text-destructive font-bold underline">NARASI HOAKS</span>.
              </span>
            ),
            color: 'success',
            bgGradient: 'bg-gradient-success'
          };
        }

        // Jika berita faktual biasa
        return {
          icon: CheckCircle,
          title: 'Berita Faktual / Terpercaya',
          description: 'Analisis menunjukkan bahwa informasi dalam artikel ini kredibel dan berasal dari sumber yang sah.',
          color: 'success',
          bgGradient: 'bg-gradient-success'
        };
      }

      case 'fake':
        return {
          icon: XCircle,
          title: 'Berita Hoax',
          description: 'Analisis menunjukkan berita ini kemungkinan besar palsu / manipulatif.',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case 'high': return 'default';
      case 'medium': return 'warning';
      case 'low': return 'destructive';
      default: return 'outline';
    }
  };

  const getMetricColor = (value: number, isInverse = false) => {
    if (isInverse) {
      return value > 70 ? 'destructive' : value > 40 ? 'warning' : 'default';
    }
    return value > 70 ? 'default' : value > 40 ? 'warning' : 'destructive';
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Result Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto p-4 rounded-full ${config.bgGradient}/20 mb-4`}>
              <Icon className={
                result.verdict === 'real' ? 'h-12 w-12 text-success' :
                result.verdict === 'fake' ? 'h-12 w-12 text-destructive' :
                result.verdict === 'suspicious' ? 'h-12 w-12 text-warning' :
                'h-12 w-12 text-muted-foreground'
              } />
            </div>
            <CardTitle className={`text-3xl font-bold ${
              result.verdict === 'fake' ? 'text-destructive' :
              result.verdict === 'real' ? 'text-success' :
              result.verdict === 'suspicious' ? 'text-warning' :
              'text-foreground'
            }`}>
              {config.title}
            </CardTitle>
            <div className="text-muted-foreground text-lg">
              {config.description}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge className={`text-lg font-semibold px-4 py-2 mb-4 ${
                result.verdict === 'fake' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                result.verdict === 'real' ? 'bg-success/20 text-success border-success/30' :
                result.verdict === 'suspicious' ? 'bg-warning/20 text-warning border-warning/30' :
                'bg-muted/20 text-muted-foreground border-muted/30'
              }`}>
                {result.verdict === 'real' ? 'FAKTUAL' : result.verdict === 'fake' ? 'HOAKS' : 'DIRAGUKAN'}
              </Badge>
              <div className={`text-5xl font-bold mb-2 ${
                result.verdict === 'fake' ? 'text-destructive' :
                result.verdict === 'real' ? 'text-success' :
                result.verdict === 'suspicious' ? 'text-warning' :
                'text-foreground'
              }`}>
                {confidencePercentage}%
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tingkat Kepercayaan Model AI
              </p>
              <Progress 
                value={confidencePercentage} 
                className={`h-4 mb-2 ${
                  result.verdict === 'fake' ? '[&>div]:bg-destructive' :
                  result.verdict === 'real' ? '[&>div]:bg-success' :
                  '[&>div]:bg-warning'
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tidak Yakin</span>
                <span>Sangat Yakin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="factcheck">Fact Check</TabsTrigger>
            <TabsTrigger value="metrics">Metrik</TabsTrigger>
            <TabsTrigger value="source">Sumber</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            
            {/* Card Ringkasan Isi Berita */}
            {result.summary && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Intisari Teks Berita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-muted/30 transition-colors group relative"
                    onClick={() => copyToClipboard(result.summary || "", "Ringkasan berita")}
                  >
                    <p className="text-sm italic leading-relaxed text-foreground/90">
                      "{result.summary}"
                    </p>
                    <Copy className="h-4 w-4 text-muted-foreground absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Analisis Sentimen & Bias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sentimen:</span>
                    <Badge variant="outline">{result.analysis.sentiment}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Kredibilitas:</span>
                    <Badge variant={getCredibilityColor(result.analysis.sourceCredibility.toLowerCase())}>
                      {result.analysis.sourceCredibility}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Bias Score:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.analysis.technicalMetrics.biasScore} className="flex-1" />
                      <span className="text-sm font-medium">{Math.round(result.analysis.technicalMetrics.biasScore)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Indikator Risiko
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Kata Kunci Berisiko:</span>
                    {result.analysis.keywordsRisk.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.keywordsRisk.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="destructive"
                            className="text-xs cursor-pointer hover:bg-destructive/80 transition-colors"
                            onClick={() => copyToClipboard(keyword, "Kata kunci")}
                          >
                            {keyword}
                            <Copy className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ✅ Tidak ada kata kunci berisiko
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Intensitas Emosional:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.analysis.technicalMetrics.emotionalIntensity} className="flex-1" />
                      <Badge variant={getMetricColor(result.analysis.technicalMetrics.emotionalIntensity, true)}>
                        {Math.round(result.analysis.technicalMetrics.emotionalIntensity)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Linguistic Patterns */}
            <Collapsible>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Pola Linguistik Terdeteksi
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.analysis.linguisticPatterns.map((pattern, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2 text-sm p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors group"
                          onClick={() => copyToClipboard(pattern, "Pola linguistik")}
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="flex-1">{pattern}</span>
                          <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>

          {/* Fact Check Tab */}
          <TabsContent value="factcheck" className="space-y-6 mt-6">
            {/* Similar News */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Berita Serupa dari Sumber Terpercaya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.analysis.factCheck.similarNews && result.analysis.factCheck.similarNews.length > 0 ? (
                  result.analysis.factCheck.similarNews.map((news, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="border border-border/50 rounded-lg p-4 space-y-2 cursor-pointer hover:bg-muted/20 transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">{news.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {news.source}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(news.date)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={getCredibilityColor(news.credibility)}>
                                {news.credibility}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(news.similarity * 100)}% mirip
                              </div>
                              <Maximize2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={news.similarity * 100} className="flex-1 h-2" />
                            {news.url && news.url !== '#' && (
                              <a 
                                href={news.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Buka Sumber
                              </a>
                            )}
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-left">{news.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span className="font-medium">{news.source}</span>
                            </div>
                            <Badge variant={getCredibilityColor(news.credibility)}>
                              Kredibilitas: {news.credibility}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                            <div>
                              <span className="text-sm text-muted-foreground">Tanggal Publikasi:</span>
                              <div className="font-medium">{formatDate(news.date)}</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Tingkat Kemiripan:</span>
                              <div className="font-medium">{Math.round(news.similarity * 100)}%</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm text-muted-foreground">Progress Kemiripan:</span>
                            <Progress value={news.similarity * 100} className="h-3" />
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => copyToClipboard(news.title, "Judul berita")}
                              className="flex-1"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Salin Judul
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                if (news.url && news.url !== '#') {
                                  window.open(news.url, '_blank', 'noopener,noreferrer');
                                } else {
                                  toast({
                                    title: "Link Tidak Tersedia",
                                    description: "URL sumber tidak tersedia untuk berita ini.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Buka Sumber
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/50">
                    Belum ada referensi berita serupa dari fact-checker untuk topik ini.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification & Expert Opinion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Verifikasi Klaim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.analysis.factCheck.claimVerification.map((claim, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-2 text-sm p-2 rounded hover:bg-muted/20 cursor-pointer transition-colors group"
                        onClick={() => copyToClipboard(claim, "Klaim verifikasi")}
                      >
                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="flex-1">{claim}</span>
                        <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Opini Ahli (Model AI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-muted/30 transition-colors group"
                    onClick={() => copyToClipboard(result.analysis.factCheck.expertOpinion, "Opini ahli")}
                  >
                    <p className="text-sm italic">"{result.analysis.factCheck.expertOpinion}"</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Sistem Deteksi HoaxGuard</span>
                      </div>
                      <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Technical Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(result.analysis.technicalMetrics).map(([key, value]) => {
                const metricConfig = {
                  readabilityScore: { 
                    label: 'Skor Keterbacaan', 
                    icon: FileText, 
                    description: 'Seberapa mudah teks dipahami',
                    isInverse: false
                  },
                  emotionalIntensity: { 
                    label: 'Intensitas Emosional', 
                    icon: Activity, 
                    description: 'Tingkat muatan emosional dalam teks',
                    isInverse: true
                  },
                  biasScore: { 
                    label: 'Skor Bias', 
                    icon: TrendingUp, 
                    description: 'Tingkat bias dalam penyajian informasi',
                    isInverse: true
                  },
                  factualDensity: { 
                    label: 'Kepadatan Faktual', 
                    icon: BarChart3, 
                    description: 'Proporsi fakta vs opini dalam teks',
                    isInverse: false
                  }
                };

                const config = metricConfig[key as keyof typeof metricConfig];
                const MetricIcon = config.icon;
                const roundedValue = Math.round(value);

                return (
                  <Dialog key={key}>
                    <DialogTrigger asChild>
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card cursor-pointer hover:shadow-lg transition-all group">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <MetricIcon className="h-5 w-5 text-primary" />
                              {config.label}
                            </div>
                            <Info className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">{roundedValue}%</div>
                            <Progress value={roundedValue} className="h-3 mb-2" />
                            <Badge variant={getMetricColor(roundedValue, config.isInverse)}>
                              {config.isInverse 
                                ? (roundedValue > 70 ? 'Tinggi' : roundedValue > 40 ? 'Sedang' : 'Rendah')
                                : (roundedValue > 70 ? 'Baik' : roundedValue > 40 ? 'Sedang' : 'Buruk')
                              }
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MetricIcon className="h-5 w-5 text-primary" />
                          {config.label}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{config.description}</p>
                        
                        <div className="text-center p-6 bg-muted/20 rounded-lg">
                          <div className="text-4xl font-bold mb-3">{roundedValue}%</div>
                          <Progress value={roundedValue} className="h-4 mb-3" />
                          <Badge variant={getMetricColor(roundedValue, config.isInverse)} className="text-sm">
                            {config.isInverse 
                              ? (roundedValue > 70 ? 'Tinggi' : roundedValue > 40 ? 'Sedang' : 'Rendah')
                              : (roundedValue > 70 ? 'Baik' : roundedValue > 40 ? 'Sedang' : 'Buruk')
                            }
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-muted/10 rounded">
                            <div className="font-medium">0-40%</div>
                            <div className="text-muted-foreground">
                              {config.isInverse ? 'Rendah' : 'Buruk'}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-muted/10 rounded">
                            <div className="font-medium">41-70%</div>
                            <div className="text-muted-foreground">Sedang</div>
                          </div>
                          <div className="text-center p-2 bg-muted/10 rounded">
                            <div className="font-medium">71-100%</div>
                            <div className="text-muted-foreground">
                              {config.isInverse ? 'Tinggi' : 'Baik'}
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(`${config.label}: ${roundedValue}%`, "Metrik")}
                          className="w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Salin Hasil Metrik
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </TabsContent>

          {/* Source Analysis Tab */}
          <TabsContent value="source" className="space-y-6 mt-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Analisis Sumber Publikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result.analysis.sourceAnalysis).map(([key, value]) => {
                    const sourceConfig = {
                      domainAge: { label: 'Asal Domain', icon: Calendar },
                      authorCredibility: { label: 'Kredibilitas Sumber', icon: Users },
                      publicationHistory: { label: 'Riwayat Publikasi', icon: FileText },
                      socialMediaPresence: { label: 'Kehadiran Media Sosial', icon: Activity }
                    };

                    const config = sourceConfig[key as keyof typeof sourceConfig];
                    const SourceIcon = config.icon;

                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <SourceIcon className="h-4 w-4 text-primary" />
                          {config.label}
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                          <p className="text-sm">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Rekomendasi Berdasarkan Analisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.verdict === 'fake' && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-medium text-destructive mb-1">⚠️ Peringatan Hoax</h4>
                          <p className="text-sm">
                            Berita ini menunjukkan karakteristik hoax yang kuat. 
                            <strong> Jangan membagikan</strong> tanpa verifikasi lebih lanjut dari sumber terpercaya.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.verdict === 'suspicious' && (
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Search className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <h4 className="font-medium text-warning mb-1">🔍 Perlu Verifikasi</h4>
                          <p className="text-sm">
                            Berita ini memerlukan pengecekan lebih lanjut. 
                            Cari sumber lain yang dapat memverifikasi informasi ini sebelum mempercayai atau membagikan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.verdict === 'real' && (
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h4 className="font-medium text-accent mb-1">✅ Terpercaya (Atau Artikel Klarifikasi)</h4>
                          <p className="text-sm">
                            Berita ini menunjukkan karakteristik informasi yang kredibel, atau merupakan artikel pengecekan fakta (Fact-Check) yang membongkar hoaks.
                            Tetap bijak dalam membagikan informasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">💡 Tips Verifikasi Tambahan:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Cek tanggal publikasi dan relevansi waktu</li>
                      <li>• Verifikasi melalui fact-checker seperti Tempo.co, Kompas.com, TurnBackHoax.id</li>
                      <li>• Bandingkan dengan berita dari media mainstream lainnya</li>
                      <li>• Perhatikan kualitas foto/video yang menyertai berita</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EnhancedAnalysisResults;