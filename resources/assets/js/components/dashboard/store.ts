import {Tab} from "./tabs";
import {applyMiddleware, compose, createStore} from "redux";
import makeReducers from "./reducers";

export default function configureStore(tabs: Tab[]) {

    const middlewares = [];

    const middlewareEnhancer = applyMiddleware(...middlewares);

    // @ts-ignore
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const enhancers = [middlewareEnhancer];
    const composeEnhancers = composeEnhancer(...enhancers);

    const store = createStore(makeReducers(), composeEnhancers);

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        console.log('Enabling hot reloading of reducers');
        module.hot.accept('./reducers', () => store.replaceReducer(makeReducers()));
    }
    return store;
}