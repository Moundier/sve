import { useRef, useState } from 'react';

const VideoPlayer = () => {

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (file) {
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

   return (
    <div className="max-w-2xl space-y-4">
      {/* File Upload */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <input
          id="video-upload"
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={insertVideo}
          className="block w-full sm:w-auto text-sm text-gray-700 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:bg-white file:text-sm file:cursor-pointer"
        />

        {videoURL && (
          <button
            onClick={removeVideo}
            className="text-sm py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
          >
            Remove
          </button>

        )}
      </div>

      {/* Video Preview */}
      {videoURL && (
        <div className="rounded overflow-hidden bg-gray-100 shadow-sm">
          <video
            controls
            src={videoURL}
            className="w-full max-h-[70vh] object-contain"
          />
        </div>
      )}
    </div>
  );

}

export default VideoPlayer;