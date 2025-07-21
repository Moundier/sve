import React, { useRef, useState } from 'react';
import VerticalBar from './VerticalBar';
// import type { Track } from '../models/Track';

type Track = {
  id: number;
  name: string;
  type: 'video' | 'audio' | 'image' | 'text';
  start: number;
  duration: number;
};

const VideoEditor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, name: 'Main Video', type: 'video', start: 0, duration: 30 },
    { id: 2, name: 'Audio Track', type: 'audio', start: 5, duration: 25 },
    { id: 3, name: 'Overlay', type: 'image', start: 10, duration: 15 },
  ]);

  const videoPlay = () => {
    console.log('Playback started');
    if (videoRef.current) {
      console.log('Current time:', videoRef.current.currentTime);
    }
  };

  const videoStop = () => {
    if (videoRef.current) {
      console.log('Playback paused at:', videoRef.current.currentTime);
    }
  };

  const updateVideoTime = () => {
    
    if (!videoRef.current) {
      return;
    }

    const videoTime: number = videoRef.current.currentTime;
    
    tracks.forEach((track: Track) => {
      
      if (Math.abs(videoTime - track.start) < 0.1) {
        console.log(`Reached start of ${track.name} (${track.type})`);
      }

      if (Math.abs(videoTime - (track.start + track.duration)) < 0.1) {
        console.log(`Reached end of ${track.name} (${track.type})`);
      }
    });
  };

  const formatSeconds = (seconds: number) => {
    const rounded = Math.round(seconds); // or Math.floor
    return `${rounded < 10 ? '0.' : ' '}${rounded}s`;
  };

  const updateVideoStream = (track: Track) => {
    console.log(`Track clicked: ${track.name}`);
    console.log('Track details:', track);
    
    if (videoRef.current) {
      videoRef.current.currentTime = track.start;
      console.log(`Jumped to ${track.start}s`);
    }
  };

  const addNewTrack = (track: Track) => {
    setTracks(prevTracks => [...prevTracks, track]);
  };

  return (
    <div>
      {/* Video Player */}
      <div className='mt-2'>
        <video
          ref={videoRef}
          width="600"
          controls
          onPlay={videoPlay}
          onPause={videoStop}
          onTimeUpdate={updateVideoTime}
        >
          <source src="/2025-07-19 22-50-01.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button
        className="mt-4 px-2 py-1 bg-blue-500 text-white rounded"
        onClick={() =>
          addNewTrack({
            id: Date.now(), // unique ID based on timestamp
            name: 'New Track',
            type: 'text',
            start: 12,
            duration: 5,
          })
        }
      >
        Add Track
      </button>

      {/* Timeline */}
      <div style={{ marginTop: '20px' }}>
        <h3>Timeline Tracks</h3>
        {tracks.map(track => (
          <div
            key={track.id} 
            onClick={() => updateVideoStream(track)}
            className='flex items-center bg-white pt-2 pb-2 pl-4 mt-2 mb-2 shadow rounded'
          >
            <strong className="min-w-[120px] inline-block">
              {track.name}
            </strong>
            <VerticalBar />
            <span>Start: {formatSeconds(track.start)}</span>
            <VerticalBar />
            <span>Duration: {formatSeconds(track.duration)}</span>
            <VerticalBar />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoEditor;