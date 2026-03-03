import { XMLParser } from 'fast-xml-parser';

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

function extractItems(items: any): RSSItem[] {
    const extractedItems: RSSItem[] = [];
    for(const item of items) {
        extractedItems.push({
            title: item.title,
            link: item.link,    
            description: item.description,
            pubDate: item.pubDate
        });
    }
    return extractedItems;
}

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
    const response = await fetch(feedUrl, {
        method: 'GET',
        mode: 'cors',   
        headers: {
            'Content-Type': 'application/rss+xml',
            'User-Agent': 'gator'
        }
    });
    const text = await response.text();
    const xmlParser = new XMLParser();
    const feed = xmlParser.parse(text);
    const rssFeed: RSSFeed = { 
        channel: {
            title: feed.rss.channel.title,
            link: feed.rss.channel.link,
            description: feed.rss.channel.description,
            item: extractItems(feed.rss.channel.item) || []
        }
    };
    return rssFeed;
}