import { VideoPlayer } from "../components/TestWebSocket/VideoPlayer"
import { useParams } from 'react-router-dom';
export const VideoSocketPage = () => {
    const { roomId } = useParams();
    return (
        <>
            <VideoPlayer roomId={roomId} />
        </>
    )
} 