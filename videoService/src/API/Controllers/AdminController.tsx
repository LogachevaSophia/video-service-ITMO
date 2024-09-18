import { UploadBlock } from "../../components/UploadedBlocks/UploadedBlocks";
import { axiosInstance } from "../axiosConfig";

export const UploadBlockController = async(data: UploadBlock) => {
    try{
        const res =  await axiosInstance.post('/blocks/upload', data);
        return res;
    }
    catch(err){
        console.log(err)
    }
   
}