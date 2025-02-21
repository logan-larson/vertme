<script lang="ts">
    import { enhance } from '$app/forms';
    
    let audioFiles = $state<FileList | null>(null);
    let isUploading = $state(false);
    let isRefreshing = $state(false);
    let error = $state<string | null>(null);
    let message = $state<string | null>(null);

    $effect(() => {
        console.log(audioFiles);
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isUploading = true;
        error = null;

        try {
            const form = event.target as HTMLFormElement;
            const formData = new FormData(form);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Upload failed');
            }

            // Reset form on success
            form.reset();
            audioFiles = null;
            
        } catch (err) {
            error = err instanceof Error ? err.message : 'Upload failed';
        } finally {
            isUploading = false;
        }
    }

    async function refreshRSSFeed() {
        isRefreshing = true;
        error = null;
        message = null;

        try {
            const response = await fetch('/api/refresh-rss', {
                method: 'POST'
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to refresh RSS feed');
            }

            message = 'RSS feed updated successfully';
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to refresh RSS feed';
        } finally {
            isRefreshing = false;
        }
    }
</script>

<div class="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-white">Upload New Episode</h1>
            <button 
                onclick={refreshRSSFeed}
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRefreshing}
            >
                {isRefreshing ? 'Refreshing...' : 'Refresh RSS Feed'}
            </button>
        </div>
        
        {#if message}
            <div class="mb-4 p-3 bg-green-600 text-white rounded-md">
                {message}
            </div>
        {/if}

        {#if error}
            <div class="mb-4 p-3 bg-red-600 text-white rounded-md">
                {error}
            </div>
        {/if}
        
        <form onsubmit={handleSubmit} class="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl">
            <div class="space-y-2">
                <label for="title" class="block text-sm font-medium text-gray-300">
                    Episode Title
                </label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
            </div>
            
            <div class="space-y-2">
                <label for="description" class="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea 
                    id="description" 
                    name="description" 
                    required
                    rows="4"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
            </div>
            
            <div class="space-y-2">
                <label for="audio" class="block text-sm font-medium text-gray-300">
                    Audio File (MP3)
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gray-500 transition-colors">
                    <div class="space-y-1 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="flex text-sm text-gray-400">
                            <label for="audio" class="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input 
                                    type="file" 
                                    id="audio" 
                                    name="audio" 
                                    accept=".mp3" 
                                    required
                                    bind:files={audioFiles}
                                    class="sr-only"
                                >
                            </label>
                            <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-400">
                            MP3 files up to 500MB
                        </p>
                    </div>
                </div>
                {#if audioFiles && audioFiles.length > 0}
                    <p class="text-sm text-gray-300 mt-2">
                        Selected file: {audioFiles[0].name}
                    </p>
                {/if}
            </div>
            
            <button 
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload Episode'}
            </button>
        </form>
    </div>
</div>
