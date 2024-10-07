import { VideoItem } from "../../components/ListVideos/ListVideos";
import { axiosInstance } from "../axiosConfig"

export const getAllVideos = async () => {
    try {
        const res = await axiosInstance.get('/video/getAll'); // Add await here
        console.log(res);
        return res.data;
    } catch (err) {
        console.log(err);
        return undefined; // Optionally return undefined or handle the error in some other way
    }
};

export interface dataCreateRoom {
    videoId: number,
    videoLink: string
}

export const apiCreateRoom = async (data: dataCreateRoom) => {
    try {
        const res = await axiosInstance.post('/room/create', data)
        return res;
    }
    catch (err) {
        console.log(err);
        return undefined;

    }
}

export interface dataGetVideo {
    roomId: string
}

export const apiGetVideoByRoomId = async (data: dataGetVideo) => {
    try {
        const res = await axiosInstance.get('/room/getVideo', {
            params:
                { ...data }
        })
        return res;
    }
    catch (err) {
        console.log(err);
        return undefined;

    }
}
