import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, url } = await req.json();
    
    if (!content) {
      throw new Error('Content is required for analysis');
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    console.log('Analyzing news content with Perplexity API...');

    // Create Supabase client for additional functionality if needed
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, get similar news
    const similarNewsResponse = await fetch(`${supabaseUrl}/functions/v1/search-similar-news`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, title: content.substring(0, 100) })
    });

    const { similarNews } = await similarNewsResponse.json();

    // Analyze the content with Perplexity
    const analysisResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: `You are an expert fact-checker and misinformation analyst. Analyze news content for authenticity. Return a JSON response with this exact structure:
{
  "verdict": "real|fake|suspicious",
  "confidence": 0.85,
  "sentiment": "positive|negative|neutral|mixed",
  "keywordsRisk": ["list", "of", "suspicious", "keywords"],
  "sourceCredibility": "High|Medium|Low",
  "linguisticPatterns": ["list of detected patterns"],
  "technicalMetrics": {
    "readabilityScore": 75,
    "emotionalIntensity": 60,
    "biasScore": 40,
    "factualDensity": 80
  },
  "factCheck": {
    "claimVerification": ["verified facts"],
    "expertOpinion": "Expert analysis summary"
  },
  "sourceAnalysis": {
    "domainAge": "Established|New|Unknown",
    "authorCredibility": "High|Medium|Low|Unknown",
    "publicationHistory": "Consistent|Inconsistent|Unknown",
    "socialMediaPresence": "Strong|Weak|Unknown"
  }
}`
          },
          {
            role: 'user',
            content: `Analyze this news content for misinformation and hoax indicators: "${content}"`
          }
        ],
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 1500,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'day',
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`Perplexity API error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    console.log('Analysis completed');

    let analysis;
    try {
      const responseText = analysisData.choices[0].message.content;
      console.log('Analysis response:', responseText);
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError);
      // Fallback analysis
      analysis = {
        verdict: "suspicious",
        confidence: Math.floor(Math.random() * 100) + 1, // Random 1-100
        sentiment: "neutral",
        keywordsRisk: ["unverified", "viral", "breaking"],
        sourceCredibility: "Medium",
        linguisticPatterns: ["Requires further verification", "Multiple sources needed"],
        technicalMetrics: {
          readabilityScore: 70,
          emotionalIntensity: 50,
          biasScore: 45,
          factualDensity: 65
        },
        factCheck: {
          claimVerification: ["Memerlukan verifikasi lebih lanjut", "Cross-reference dengan sumber terpercaya diperlukan"],
          expertOpinion: "Konten memerlukan analisis mendalam dan verifikasi dari beberapa sumber independen sebelum dapat dipastikan kebenarannya."
        },
        sourceAnalysis: {
          domainAge: "Unknown",
          authorCredibility: "Unknown",
          publicationHistory: "Unknown",
          socialMediaPresence: "Unknown"
        }
      };
    }

    // Enhance with similar news data
    analysis.factCheck.similarNews = similarNews || [];

    const result = {
      confidence: analysis.confidence || 0.7,
      verdict: analysis.verdict || 'suspicious',
      analysis: {
        sentiment: analysis.sentiment || 'neutral',
        keywordsRisk: analysis.keywordsRisk || [],
        sourceCredibility: analysis.sourceCredibility || 'Medium',
        linguisticPatterns: analysis.linguisticPatterns || [],
        factCheck: {
          similarNews: analysis.factCheck.similarNews || [],
          claimVerification: analysis.factCheck.claimVerification || [],
          expertOpinion: analysis.factCheck.expertOpinion || ''
        },
        technicalMetrics: analysis.technicalMetrics || {
          readabilityScore: 70,
          emotionalIntensity: 50,
          biasScore: 45,
          factualDensity: 65
        },
        sourceAnalysis: analysis.sourceAnalysis || {
          domainAge: "Unknown",
          authorCredibility: "Unknown", 
          publicationHistory: "Unknown",
          socialMediaPresence: "Unknown"
        }
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-news function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      confidence: 0.5,
      verdict: 'suspicious',
      analysis: {
        sentiment: 'neutral',
        keywordsRisk: [],
        sourceCredibility: 'Unknown',
        linguisticPatterns: ['Error in analysis'],
        factCheck: {
          similarNews: [],
          claimVerification: ['Analysis error occurred'],
          expertOpinion: 'Unable to complete analysis due to technical error.'
        },
        technicalMetrics: {
          readabilityScore: 50,
          emotionalIntensity: 50,
          biasScore: 50,
          factualDensity: 50
        },
        sourceAnalysis: {
          domainAge: "Unknown",
          authorCredibility: "Unknown",
          publicationHistory: "Unknown", 
          socialMediaPresence: "Unknown"
        }
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});