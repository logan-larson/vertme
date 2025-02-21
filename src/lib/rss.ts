import type { PodcastMetadata, PodcastEpisode } from './types/podcast';

export function generateRSSFeed(metadata: PodcastMetadata): string {
    const items = metadata.episodes.map(episode => generateRSSItem(episode, metadata)).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
    <channel>
        <title>${metadata.title}</title>
        <description>${metadata.description}</description>
        <link>https://your-website.com</link>
        <language>${metadata.language}</language>
        <itunes:author>${metadata.author}</itunes:author>
        <itunes:image href="${metadata.imageUrl}"/>
        <itunes:category text="${metadata.category}"/>
        ${items}
    </channel>
</rss>`;
}

function generateRSSItem(episode: PodcastEpisode, metadata: PodcastMetadata): string {
    // Convert string date to Date object if necessary
    const pubDate = episode.publishDate instanceof Date 
        ? episode.publishDate 
        : new Date(episode.publishDate);

    // Convert duration to itunes:duration format
    const duration = episode.duration || '00:00';
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const itunesDuration = totalSeconds.toString();

    return `
        <item>
            <title>${episode.title}</title>
            <description>${episode.description}</description>
            <pubDate>${pubDate.toUTCString()}</pubDate>
            <enclosure url="${episode.audioUrl}" type="audio/mpeg" length="${episode.fileSize}"/>
            <itunes:author>${metadata.author}</itunes:author>
            <itunes:image href="${metadata.imageUrl}"/>
            <itunes:episodeType>full</itunes:episodeType>
            <itunes:explicit>false</itunes:explicit>
            <itunes:duration>00:00:00</itunes:duration>
        </item>
    `;

    // <itunes:duration>${itunesDuration}</itunes:duration>
} 