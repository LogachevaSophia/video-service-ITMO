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

export interface dataCreateRoom{
    videoId: number
}

export const apiCreateRoom = async (data: dataCreateRoom) => {
    try {
        const res = await axiosInstance.post('/video/createRoom', data)
        return res;
    }
    catch (err) {
        console.log(err);
        return undefined;

    }
}
