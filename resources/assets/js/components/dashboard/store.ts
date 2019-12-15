import {Tab} from "./tabs";
import {applyMiddleware, compose, createStore, Store as ReduxStore} from "redux";
import makeReducers from "./reducers";


interface Store extends ReduxStore {
    dynamicReducers: object
}

export default function configureStore(tabs: Tab[]) {

    const middlewares = [];

    const middlewareEnhancer = applyMiddleware(...middlewares);

    // @ts-ignore
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const enhancers = [middlewareEnhancer];
    const composeEnhancers = composeEnhancer(...enhancers);

    const store: Store = createStore(makeReducers(), composeEnhancers);
    store.dynamicReducers = {};

    // Tab registration
    tabs.forEach(tab => {
        if (tab.reducer) {
            store.dynamicReducers[tab.key] = tab.reducer;
        }
    });

    store.replaceReducer(makeReducers(store.dynamicReducers));

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        console.log('Enabling hot reloading of reducers');
        module.hot.accept('./reducers', () => {
            console.log('Hot reloading reducers');
            store.replaceReducer(makeReducers(store.dynamicReducers))
        });
    }
    return store;
}