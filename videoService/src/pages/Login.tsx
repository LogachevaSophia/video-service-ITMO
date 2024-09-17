import { useState } from "react"
import { LoginForm } from "../components/LoginForm/LoginForm"
import { RegisterForm } from "../components/LoginForm/RegisterForm";
import { Button, Card, Tabs } from "@gravity-ui/uikit";
import { FormProvider, useForm } from "react-hook-form";
import styles from './Login.module.css'
import { AuthLogin, AuthRegister } from "../API/Controllers/AuthController";

export const Login = () => {
    const [login, setValue] = useState<string>("register");
    const handleSelect = (data: string) => {
        console.log(data)
        setValue(data)
    }
    const methods = useForm();
    const onSubmit = async (data: any) => {
        console.log(login)
        if (login == "register") {
            const res = AuthRegister(data);
        }
        else {
            const res = await AuthLogin(data);
            console.log(res)
            localStorage.setItem("token", res?.data.token)

        }
    }

    const { handleSubmit } = methods;

    return (
        <section className={styles["registration-form-container"]}>
            <Card type="container" view="outlined" size="l">
                <Tabs
                    activeTab={login}
                    items={[
                        { id: 'login', title: 'Log in' },
                        { id: 'register', title: 'Register' },
                    ]}
                    onSelectTab={handleSelect}
                    className={styles.tabs}
                />
                <FormProvider {...methods}>
                    <form className={styles["registration-form"]} onSubmit={handleSubmit(onSubmit)}>
                        {login === "login" && <LoginForm />}
                        {login === "register" && <RegisterForm />}
                        <Button type="submit" view="action"> Get it!</Button>
                    </form>
                </FormProvider>

            </Card>

        </section>)
}

