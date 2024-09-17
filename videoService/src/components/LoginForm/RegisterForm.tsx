import { Select, TextInput } from "@gravity-ui/uikit"
import { useFormContext } from "react-hook-form"

export const RegisterForm = () => {
    const { register } = useFormContext();
    return (
        <>
            <TextInput 
                placeholder="Email" 
                {...register('Email')} 
            />
            <TextInput 
                placeholder="Name" 
                {...register('Name')} 
            />
            <TextInput 
                placeholder="LastName" 
                {...register('LastName')} 
            />
            <TextInput 
                placeholder="SecondName" 
                {...register('SecondName')} 
            />
            <TextInput 
                type="password" 
                placeholder="Password" 
                {...register('Password')} 
            />
            <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
            </Select>
        </>
    )
}
