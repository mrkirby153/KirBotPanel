import React from 'react';
import {default as Dash} from "../Dashboard";
import {Provider} from 'react-redux';
import configureStore from "./store";
import tabs from "./tabs";
import {BrowserRouter} from "react-router-dom";

export default function Dashboard() {
    const store = configureStore(tabs);
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Dash/>
            </BrowserRouter>
        </Provider>
    )
}