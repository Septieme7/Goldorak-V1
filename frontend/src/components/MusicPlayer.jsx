import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

// Liste des musiques (à adapter selon mes fichiers "noms")
const tracks = [
    { name: "Générique Goldorak", src: "/musiques/goldorak-generique.mp3" },
    { name: "Actarus, déploie-toi !", src: "/musiques/actarus-deploie-toi.mp3" },
    { name: "Combat Spatial", src: "/musiques/combat-spatial.mp3" },
    { name: "L'Attaque de Véga", src: "/musiques/vega-attaque.mp3" }
];

function MusicPlayer() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Lecture automatique quand on change de piste si la lecture était active
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(err => console.log("Lecture auto bloquée par navigateur", err));
        }
    }, [currentTrackIndex]);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.log("Erreur lecture", err));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTrackEnd = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
    };

    const handleNext = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(prevIndex);
        setIsPlaying(true);
    };

    const handleSelectTrack = (index) => {
        if (index === currentTrackIndex && isPlaying) return;
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    return (
        <div className="goldorak-music-player">
            <audio
                ref={audioRef}
                src={tracks[currentTrackIndex].src}
                onEnded={handleTrackEnd}
            />
            <div className="player-bar">
                <button className="player-btn" onClick={handlePrev} title="Piste précédente">⏮</button>
                <button className="player-btn play-pause" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Lecture"}>
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="player-btn" onClick={handleNext} title="Piste suivante">⏭</button>
                <div className="track-name">{tracks[currentTrackIndex].name}</div>
            </div>
            <div className="playlist-dropdown">
                <button className="playlist-toggle">📀 Playlist</button>
                <div className="playlist-content">
                    {tracks.map((track, idx) => (
                        <div
                            key={idx}
                            className={`playlist-item ${idx === currentTrackIndex ? 'active' : ''}`}
                            onClick={() => handleSelectTrack(idx)}
                        >
                            <span className="playlist-icon">{idx === currentTrackIndex && isPlaying ? "🔊" : "🎵"}</span>
                            {track.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;