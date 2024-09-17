import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./ThemeSlice";


export const store = configureStore({
    reducer:
        { themeStore: themeSlice.reducer },

})

export type RootState = ReturnType<typeof store.getState>;