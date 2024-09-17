import { TextInput } from "@gravity-ui/uikit"
import { useFormContext } from "react-hook-form"

export const LoginForm = () => {
    const { register } = useFormContext()
    return (
        <>
            <TextInput placeholder="login/email"  {...register('Email', { required: 'Имя пользователя обязательно' })} />
            <TextInput type="password" placeholder="password"  {...register('Password', { required: 'Имя пользователя обязательно' })} />
        </>
    )
}