import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";
export type themeType = "dark" | "light"

interface ThemeSliceInterface {
    theme: themeType
}


const initialState: ThemeSliceInterface = {
    theme:"light"
}

export const themeSlice = createSlice({
    name: 'themeStore',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            return produce(state, (draft) => {
                if (draft.theme == "dark"){
                    draft.theme = "light"
                }
                else{
                    draft.theme = "dark";
                }
            })
        }
    }
})
export const {toggleTheme} = themeSlice.actions;
// export type RootState = ReturnType<typeof store.getState>;
export default themeSlice.reducer;