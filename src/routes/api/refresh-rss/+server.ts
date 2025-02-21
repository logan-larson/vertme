import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadToS3 } from '$lib/s3';
import { generateRSSFeed } from '$lib/rss';
import { getMetadata } from '$lib/store';

export const POST: RequestHandler = async () => {
    try {
        // Get current metadata
        const metadata = await getMetadata();
        
        // Generate and upload new RSS feed
        const rssFeed = generateRSSFeed(metadata);
        await uploadToS3('test-podcast', 'rss.xml', rssFeed, 'application/xml');

        return json({
            success: true,
            message: 'RSS feed updated successfully'
        });
    } catch (error) {
        console.error('RSS refresh error:', error);
        return json({
            success: false,
            error: 'Failed to refresh RSS feed'
        }, { status: 500 });
    }
}; 