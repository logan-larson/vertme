export interface PodcastEpisode {
    title: string;
    description: string;
    publishDate: Date | string;
    audioUrl: string;
    duration?: string;
    fileSize?: number;
}

export interface PodcastMetadata {
    title: string;
    description: string;
    author: string;
    email: string;
    imageUrl: string;
    category: string;
    language: string;
    episodes: PodcastEpisode[];
} 