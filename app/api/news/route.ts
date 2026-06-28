import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    // Returning a mock response so the UI still looks good while the user hasn't set the API key
    return NextResponse.json({
      articles: [
        {
          title: "Please add your NEWS_API_KEY to .env",
          url: "#",
          publishedAt: new Date().toISOString(),
          source: { name: "System" }
        }
      ]
    });
  }

  try {
    // Fetch news related to tech, computer science, and software
    const response = await fetch(
      `https://newsapi.org/v2/everything?q="computer science" OR technology OR software&language=en&sortBy=publishedAt&pageSize=10`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
        // Cache the response for 1 hour to avoid hitting API rate limits
        next: { revalidate: 3600 } 
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from NewsAPI');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
