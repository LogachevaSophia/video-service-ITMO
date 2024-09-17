import { axiosInstance } from "../axiosConfig"
interface UserInterface {
    Name: string,
    LastName?: string,
    SecondName?: string,
    Email: string,
    Password: string,
    Gender?: "Male" | "Female"
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