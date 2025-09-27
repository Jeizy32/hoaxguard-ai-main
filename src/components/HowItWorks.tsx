import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Search, 
  Database, 
  Shield, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Zap,
  Eye,
  Globe
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Analisis Input",
      description: "Sistem menerima teks berita atau URL artikel yang akan dianalisis",
      details: [
        "Preprocessing teks untuk membersihkan data",
        "Ekstraksi fitur linguistik dan semantik",
        "Normalisasi format untuk analisis optimal"
      ]
    },
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Model AI menganalisis konten menggunakan algoritma deep learning",
      details: [
        "Natural Language Processing (NLP) untuk pemahaman konteks",
        "Analisis sentiment dan bias detection",
        "Pattern recognition untuk identifikasi hoax"
      ]
    },
    {
      icon: Database,
      title: "Cross-Reference",
      description: "Verifikasi dengan database berita terpercaya dan fact-checker",
      details: [
        "Pencarian berita serupa dari sumber kredibel",
        "Validasi fakta dengan database referensi",
        "Analisis kredibilitas sumber publikasi"
      ]
    },
    {
      icon: BarChart3,
      title: "Scoring & Metrics",
      description: "Perhitungan skor kepercayaan dan metrik analisis detail",
      details: [
        "Confidence score berdasarkan multiple factors",
        "Technical metrics (bias, emotional intensity)",
        "Risk assessment dan credibility scoring"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Akurasi Tinggi",
      description: "Model dilatih dengan dataset besar dari berita terverifikasi",
      stat: "95%+"
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Hasil analisis dalam hitungan detik",
      stat: "< 5s"
    },
    {
      icon: Eye,
      title: "Multi-dimensional",
      description: "Analisis linguistik, sentiment, dan source credibility",
      stat: "15+"
    },
    {
      icon: Globe,
      title: "Bahasa Indonesia",
      description: "Dioptimalkan khusus untuk konten berbahasa Indonesia",
      stat: "Native"
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 px-4 bg-card/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Cara Kerja HoaxGuard AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Teknologi machine learning terdepan untuk deteksi hoax dengan akurasi tinggi
          </p>
        </div>

        {/* How it Works Steps */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Proses Analisis AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card h-full hover:shadow-glow transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto p-4 bg-primary/20 rounded-full mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-sm font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
                          Step {index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between cards */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Keunggulan Teknologi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card text-center hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="mx-auto p-3 bg-primary/20 rounded-full mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{feature.stat}</div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Arsitektur AI Model</CardTitle>
            <p className="text-muted-foreground">
              Kombinasi algoritma machine learning untuk hasil optimal
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-primary/20 rounded-lg">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Deep Learning</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Transformer Architecture</p>
                  <p>• BERT-based Language Model</p>
                  <p>• Multi-layer Neural Networks</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-primary/20 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Feature Engineering</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Linguistic Features</p>
                  <p>• Semantic Embeddings</p>
                  <p>• Statistical Analysis</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-primary/20 rounded-lg">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Validation Layer</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Cross-validation</p>
                  <p>• Ensemble Methods</p>
                  <p>• Confidence Scoring</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="p-8 bg-gradient-primary/10 border border-primary/20 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">
              Siap Mencoba Teknologi AI Terdepan?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Lindungi diri Anda dan orang terdekat dari penyebaran berita hoax dengan 
              teknologi deteksi AI yang akurat dan terpercaya.
            </p>
            <button
              onClick={() => document.getElementById('analisis')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 px-8 py-3 rounded-lg text-primary-foreground font-medium"
            >
              Mulai Analisis Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;