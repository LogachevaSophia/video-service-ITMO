import { useEffect, useState } from "react";
import { VideoPlayer } from "../components/TestWebSocket/VideoPlayer"
import { useParams } from 'react-router-dom';
import { apiGetVideoByRoomId } from "../API/Controllers/VideoController";
export const VideoSocketPage = () => {
    const { roomId } = useParams();
    const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4")
    useEffect(() => {
        const getVideo = async (roomId: string) => {
            try {
                const response = await apiGetVideoByRoomId({ roomId })
                setVideoUrl(response?.data.videoLink)
            }
            catch (err) {
                console.error(err)
            }

        }
        if (roomId)
            getVideo(roomId);
    }, [roomId])
    return (
        <>
            <VideoPlayer roomId={roomId} s3VideoUrl={videoUrl} />
        </>
    )
} 