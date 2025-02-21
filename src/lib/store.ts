import { writeFile, readFile } from 'fs/promises';
import type { PodcastMetadata, PodcastEpisode } from './types/podcast';
import { env } from '$env/dynamic/private';

const METADATA_FILE = 'podcast_metadata.json';

const defaultMetadata: PodcastMetadata = {
    title: env.PODCAST_TITLE || 'My Podcast',
    description: env.PODCAST_DESCRIPTION || 'A great podcast',
    author: env.PODCAST_AUTHOR || 'Anonymous',
    email: env.PODCAST_EMAIL || 'podcast@example.com',
    imageUrl: env.PODCAST_IMAGE_URL || 'https://example.com/podcast.jpg',
    category: env.PODCAST_CATEGORY || 'Technology',
    language: env.PODCAST_LANGUAGE || 'en',
    episodes: []
};

export async function getMetadata(): Promise<PodcastMetadata> {
    try {
        const data = await readFile(METADATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default metadata
        return defaultMetadata;
    }
}

export async function addEpisode(episode: PodcastEpisode): Promise<PodcastMetadata> {
    const metadata = await getMetadata();
    metadata.episodes.push(episode);
    await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
    return metadata;
} 