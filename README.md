# Podcast RSS Feed Generator

A web application built with SvelteKit that allows you to manage a podcast by uploading episodes and automatically generating an RSS feed.

## Features

- Upload podcast episodes (MP3 files)
- Add episode titles and descriptions 
- Automatic RSS feed generation and updates
- S3-compatible storage backend
- Simple web interface for managing episodes

## Setup

1. Clone the repository

2. Install dependencies:

```
npm install
```

3. Create a `.env` file with the following variables:

```
S3_ENDPOINT=https://your-bucket.region.linodeobjects.com
S3_REGION=your-region
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name

# Optional podcast metadata defaults
PODCAST_TITLE=Your Podcast Title
PODCAST_DESCRIPTION=Your Description
PODCAST_AUTHOR=Your Name
PODCAST_EMAIL=your@email.com
PODCAST_IMAGE_URL=https://your-image-url.com/image.png
PODCAST_CATEGORY=Technology
PODCAST_LANGUAGE=en
```

4. Start the development server:

```
npm run dev
```

## Project Structure

- `src/routes/`
  - `+page.svelte` - Main upload interface
  - `api/upload/+server.ts` - File upload endpoint
  - `api/refresh-rss/+server.ts` - RSS refresh endpoint

- `src/lib/`
  - `s3.ts` - S3 client and upload utilities
  - `rss.ts` - RSS feed generation
  - `store.ts` - Metadata storage management
  - `types/podcast.ts` - TypeScript interfaces

## Usage

1. Access the web interface at `http://localhost:5173`
2. Upload MP3 files with title and description
3. Files are stored in S3 and the RSS feed is automatically updated
4. Access your podcast RSS feed at:

```
https://your-bucket.region.linodeobjects.com/test-podcast/rss.xml
```

## Tech Stack

- SvelteKit
- AWS SDK (S3 Client)
- TailwindCSS
- TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


