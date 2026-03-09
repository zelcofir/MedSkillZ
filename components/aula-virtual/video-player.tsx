'use client'

import React from 'react'

interface VideoPlayerProps {
    url: string
}

export function VideoPlayer({ url }: VideoPlayerProps) {
    // Check if it's YouTube
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
    const isVimeo = url.includes('vimeo.com')

    let embedUrl = url

    if (isYouTube) {
        const videoId = url.includes('v=')
            ? url.split('v=')[1]?.split('&')[0]
            : url.split('/').pop()
        embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (isVimeo) {
        const videoId = url.split('/').pop()
        embedUrl = `https://player.vimeo.com/video/${videoId}`
    }

    return (
        <div className="aspect-video w-full overflow-hidden bg-slate-900 rounded-lg shadow-sm">
            <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Player"
            />
        </div>
    )
}
