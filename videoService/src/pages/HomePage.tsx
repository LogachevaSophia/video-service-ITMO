import { useEffect, useState } from "react"
import { ListVideos } from "../components/ListVideos/ListVideos"
import { getAllVideos, apiCreateRoom } from "../API/Controllers/VideoController"
import { useNavigate } from "react-router-dom"

export const HomePage = () => {
    const [data, setData] = useState([])

    const createRoomAs = async (videoId: number, videoLink:string) => {
        try{
            const response = await apiCreateRoom({videoId, videoLink});
            navigate(`/video/${response?.data.roomId}`)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await getAllVideos();
                if (response && response.data) {
                    setData(response.data); 
                } else {
                    setData([]); 
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
                setData([]);
            }
        }
        getVideo();
    }, [])
    // const data: VideoItem[] = [
    //     {
    //         id: "dfjdn;kvj",
    //         title: "Финансирование",
    //         description: "Описание блока финанисорвание",
    //         author: "такой-то чел",
    //         avatarSrc: "https://loremflickr.com/640/480/cats?lock=8610182282084352",
    //         preview: "https://i.pinimg.com/736x/48/02/6b/48026b5e2493e6bd175f1f27615b9bc3.jpg"
    //     },
    //     {
    //         id: "dfjdn;kvjdfvd",
    //         title: "Финансирование2",
    //         description: "Описание блока финанисорвание eltj gnljglwetg;q kjn;",
    //         author: "такой-то чел",
    //         preview: "https://i.pinimg.com/736x/48/02/6b/48026b5e2493e6bd175f1f27615b9bc3.jpg"
    //     },
    //     {
    //         id: "dfjdn;kvjdfvdwef",
    //         title: "Финансирование3",
    //         description: "Описание блока финанисорвание",
    //         author: "такой-то чел",
    //         avatarSrc: "https://loremflickr.com/640/480/cats?lock=8610182282084352"
    //     },
    //     {
    //         id: "dfjddfvjdfvd",
    //         title: "Финансирование4",
    //         description: "Описание блока финанисорвание",
    //         author: "такой-то чел",
    //     }
    // ]
    const navigate = useNavigate();
    return (
        <>
            <ListVideos data={data} actionCreate={(id, link) => createRoomAs(Number(id), link)}/>
        </>
    )
}