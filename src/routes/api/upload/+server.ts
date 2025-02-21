import { json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { uploadToS3 } from '$lib/s3';
import { generateRSSFeed } from '$lib/rss';
import { addEpisode } from '$lib/store';
import type { PodcastEpisode } from '$lib/types/podcast';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        // Upload audio file to S3
        const fileName = `${Date.now()}-${audioFile.name}`;
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const audioUrl = await uploadToS3('test-podcast', fileName, buffer, 'audio/mpeg');

        // Create new episode
        const newEpisode: PodcastEpisode = {
            title,
            description,
            publishDate: new Date(),
            audioUrl,
            fileSize: audioFile.size
        };

        // Add episode and get updated metadata
        const updatedMetadata = await addEpisode(newEpisode);

        // Generate and upload new RSS feed
        const rssFeed = generateRSSFeed(updatedMetadata);
        await uploadToS3('test-podcast', 'rss.xml', rssFeed, 'application/xml');

        return json({
            success: true,
            episode: newEpisode
        });
    } catch (error) {
        console.error('Upload error:', error);
        return json({
            success: false,
            error: 'Failed to upload episode'
        }, { status: 500 });
    }
}; 