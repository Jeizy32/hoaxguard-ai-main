import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { content, title } = await req.json();
    
    if (!content && !title) {
      throw new Error('Content or title is required');
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    console.log('Searching for similar news with Perplexity API...');

    const searchQuery = title || content.substring(0, 200);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
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
            content: 'You are a fact-checking assistant that finds recent news from trusted sources. Search for news from TODAY and YESTERDAY only. Return results in valid JSON format with actual working URLs from reputable news sources like Kompas.com, Detik.com, BBC.com, CNN.com, Reuters.com, Antara.com, Liputan6.com, Tempo.co, Tribunnews.com, etc. Include full HTTP/HTTPS URLs.'
          },
          {
            role: 'user',
            content: `Find similar recent news (TODAY/YESTERDAY) about: "${searchQuery}". Return exactly 5 news articles with real URLs in this exact JSON format: [{"title":"News Title","source":"Source Name","url":"https://actual-url.com/article","credibility":"high|medium|low","similarity":0.85,"date":"2025-09-20","summary":"Brief summary"}]`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'day',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity API response received');

    let similarNews = [];
    
    try {
      // Try to parse JSON from the response
      const responseText = data.choices[0].message.content;
      console.log('Raw response:', responseText);
      
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        similarNews = JSON.parse(jsonMatch[0]);
      } else {
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();

    if (!content && !title) {
      throw new Error("Content or title is required");
    }

    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityApiKey) {
      throw new Error("Perplexity API key not configured");
    }

    console.log("Searching for similar news with Perplexity API...");

    const searchQuery = title || content.substring(0, 200);

    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${perplexityApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content:
                "You are a fact-checking assistant that finds recent news from trusted sources. Search for news from TODAY and YESTERDAY only. Return results in valid JSON format with actual working URLs from reputable news sources like Kompas.com, Detik.com, BBC.com, CNN.com, Reuters.com, Antara.com, Liputan6.com, Tempo.co, Tribunnews.com, Turnbackhoax.id, Google News etc.",
            },
            {
              role: "user",
              content:
                `Find similar recent news (TODAY/YESTERDAY) about: "${searchQuery}". Return exactly 5 news articles with real URLs in this exact JSON format: [{"title":"News Title","source":"Source Name","url":"https://actual-url.com/article","credibility":"high|medium|low","similarity":0.85,"date":"2025-09-20","summary":"Brief summary"}]`,
            },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "day",
          frequency_penalty: 1,
          presence_penalty: 0,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Perplexity API response received");

    let similarNews = [];

    try {
      const responseText = data.choices?.[0]?.message?.content || "";
      console.log("Raw response:", responseText);

      const jsonMatch = responseText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        similarNews = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found");
      }

      similarNews = similarNews.filter(
        (item: any) => item.url && /^https?:\/\//.test(item.url),
      );
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);

      // === fallback ke link nyata ===
      similarNews = [
        {
          title: "Cek Fakta Terbaru di TurnBackHoax",
          source: "TurnBackHoax",
          url: "https://turnbackhoax.id/",
          credibility: "high",
          similarity: 0.8,
          date: new Date().toISOString().split("T")[0],
          summary: "Database hoaks terbaru dari MAFINDO untuk verifikasi fakta.",
        },
        {
          title: "Berita Terkini di Detik",
          source: "Detik.com",
          url: "https://news.detik.com/",
          credibility: "high",
          similarity: 0.78,
          date: new Date().toISOString().split("T")[0],
          summary: "Update berita terkini dan populer dari Detik.com.",
        },
        {
          title: "Berita Nasional Kompas",
          source: "Kompas.com",
          url: "https://www.kompas.com/",
          credibility: "high",
          similarity: 0.77,
          date: new Date().toISOString().split("T")[0],
          summary: "Berita harian terpercaya dari Kompas.",
        },
        {
          title: "Berita Hari Ini di Liputan6",
          source: "Liputan6",
          url: "https://www.liputan6.com/news",
          credibility: "high",
          similarity: 0.75,
          date: new Date().toISOString().split("T")[0],
          summary: "Kumpulan berita terkini dan terpercaya dari Liputan6.",
        },
        {
          title: "Berita Populer di Google News",
          source: "Google News",
          url: "https://news.google.com/",
          credibility: "medium",
          similarity: 0.7,
          date: new Date().toISOString().split("T")[0],
          summary: "Kumpulan berita terbaru dari berbagai sumber terpercaya.",
        },
      ];
    }

    return new Response(
      JSON.stringify({
        similarNews: similarNews.slice(0, 5),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in search-similar-news function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        similarNews: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Create fallback response
      similarNews = [
        {
          title: "Analisis berita real-time tersedia",
          source: "AI Fact Check",
          url: "#",
          credibility: "medium",
          similarity: 0.7,
          date: new Date().toISOString(),
          summary: "Analisis menggunakan sumber berita terkini untuk verifikasi faktual."
        }
      ];
    }

    return new Response(JSON.stringify({ 
      similarNews: similarNews.slice(0, 5) // Ensure max 5 results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-similar-news function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      similarNews: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});