import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ListVideos, VideoItem } from "../components/ListVideos/ListVideos";
import { getAllVideos, apiCreateRoom } from "../API/Controllers/VideoController";
import { useNavigate } from "react-router-dom";
import { TextInput } from "@gravity-ui/uikit";
import { useDebounce } from "@uidotdev/usehooks";

export const HomePage = () => {
    const [data, setData] = useState<VideoItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<VideoItem[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 100);
    const navigate = useNavigate();

    const createRoomAs = async (videoId: number, videoLink: string) => {
        try {
            const response = await apiCreateRoom({ videoId, videoLink });
            navigate(`/video/${response?.data.roomId}`);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await getAllVideos();
                if (response && response.data) {
                    setData(response.data);
                    setResults(response.data);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
                setData([]);
            }
        };
        getVideo();
    }, []);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const filteredData = data.filter((el: VideoItem) => 
                el.Name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setResults(filteredData);
        } else {
            setResults(data); // Если пустой запрос, показываем все данные
        }
    }, [debouncedSearchTerm, data]); // Теперь зависим от debouncedSearchTerm и data

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <TextInput placeholder="🔍 Find film " size="xl" onChange={handleChange} />
            <ListVideos data={results} actionCreate={(id, link) => createRoomAs(Number(id), link)} />
        </>
    );
};
