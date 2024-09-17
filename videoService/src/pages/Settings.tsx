import { Icon, RadioButton, RadioButtonOption } from "@gravity-ui/uikit"
import { Sun, Moon } from '@gravity-ui/icons';
import { toggleTheme } from "../store/ThemeSlice";
import { useDispatch } from "react-redux";
import { useCallback } from "react";


export const options: RadioButtonOption[] = [
    { value: 'dark', content: <Icon data={Sun}></Icon> },
    { value: 'light', content: <Icon data={Moon}></Icon> },
];

export const Settings = () => {
    const dispatch = useDispatch();

    const handleChange = useCallback(() => {
        dispatch(toggleTheme())
    }, [])
    return (
        <RadioButton name="group1" defaultValue={options[0].value} options={options} onUpdate={handleChange} />
    )
}