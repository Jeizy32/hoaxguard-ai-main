import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Coba baca body JSON
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {}; // fallback kalau kosong / invalid
    }

    const { content, title } = body;

    if (!content && !title) {
      return new Response(
        JSON.stringify({ error: "Content or title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 🔑 API Key (sementara skip kalau belum ada)
    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY") || null;

    console.log("Searching similar news...");
    const searchQuery = title || content.substring(0, 200);

    // === DEMO RESULT SEMENTARA ===
    // (Google News, TurnBackHoax, Liputan6, Detik, Kompas)
    const similarNews = [
      {
        title: "Cek Fakta di TurnBackHoax",
        source: "TurnBackHoax",
        url: "https://turnbackhoax.id/",
        credibility: "high",
        similarity: 0.9,
        date: new Date().toISOString().split("T")[0],
        summary: "Database hoaks terbaru dari MAFINDO untuk verifikasi fakta.",
      },
      {
        title: "Berita Terkini di Detik",
        source: "Detik.com",
        url: "https://news.detik.com/",
        credibility: "high",
        similarity: 0.85,
        date: new Date().toISOString().split("T")[0],
        summary: "Update berita populer dan terkini dari Detik.com.",
      },
      {
        title: "Laporan Fakta Kompas",
        source: "Kompas.com",
        url: "https://www.kompas.com/",
        credibility: "high",
        similarity: 0.83,
        date: new Date().toISOString().split("T")[0],
        summary: "Berita terbaru, nasional, internasional, hingga fact-check.",
      },
      {
        title: "Liputan6 Cek Fakta",
        source: "Liputan6.com",
        url: "https://www.liputan6.com/cek-fakta",
        credibility: "high",
        similarity: 0.82,
        date: new Date().toISOString().split("T")[0],
        summary: "Artikel cek fakta terkini dari Liputan6.",
      },
      {
        title: "Google News Hari Ini",
        source: "Google News",
        url: "https://news.google.com/",
        credibility: "medium",
        similarity: 0.8,
        date: new Date().toISOString().split("T")[0],
        summary: "Kumpulan berita terbaru dari berbagai sumber terpercaya.",
      },
    ];

    return new Response(
      JSON.stringify({ similarNews: similarNews.slice(0, 5) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in search-similar-news function:", error);
    return new Response(
      JSON.stringify({ error: error.message, similarNews: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
