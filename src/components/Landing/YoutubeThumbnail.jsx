import React from "react";

import explore from "../../assets/homeimg.png";
const YouTubeThumbnail = ({ videoUrl }) => {
  const extractVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block w-auto border-2 rounded-lg border-red-600"
    >
      <img
        src={explore}
        alt="YouTube Thumbnail"
        style={{
          height: "400px",
          width: "auto",
          objectFit: "cover",
          display: "block",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "16px solid white",
            marginLeft: "4px",
          }}
        />
      </div>
    </a>
  );
};

export default YouTubeThumbnail;
