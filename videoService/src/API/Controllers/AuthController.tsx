import { axiosInstance } from "../axiosConfig"
export interface UserInterface {
    Name?: string,
    LastName?: string,
    SecondName?: string,
    Email: string,
    Password: string,
    Gender?: string
}


export const AuthRegister = async (data: UserInterface) => {
    axiosInstance.post('/auth/register', data).then(result => {return result}).catch(err => {console.error(err)})
}

export const AuthLogin =  async (data: UserInterface) => {
    try{
        const res = await axiosInstance.post('/auth/login', data);
        return res
    }
    catch(err){
        console.error(err)
    }
}