import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import DetectionInterface from "@/components/DetectionInterface";
import EnhancedAnalysisResults from "@/components/EnhancedAnalysisResults";
import Footer from "@/components/Footer";

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

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null);
  const detectionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const handleGetStarted = () => {
    detectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result: DetectionResult) => {
    setAnalysisResult(result);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        <HeroSection onGetStarted={handleGetStarted} />
        
        <HowItWorks />
        
        <section ref={detectionRef}>
          <DetectionInterface onAnalysisComplete={handleAnalysisComplete} />
        </section>
        
        {analysisResult && (
          <section ref={resultsRef}>
            <EnhancedAnalysisResults result={analysisResult} />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
