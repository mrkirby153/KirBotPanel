import {Tab} from "./tabs";
import {applyMiddleware, compose, createStore, Store as ReduxStore} from "redux";
import makeReducers from "./reducers";
import createSagaMiddleware from 'redux-saga';


interface Store extends ReduxStore {
    dynamicReducers: object
    dynamicSagas: object
}

export default function configureStore(tabs: Tab[]) {

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];

    const middlewareEnhancer = applyMiddleware(...middlewares);

    // @ts-ignore
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const enhancers = [middlewareEnhancer];
    const composeEnhancers = composeEnhancer(...enhancers);

    const store: Store = createStore(makeReducers(), composeEnhancers);
    store.dynamicReducers = {};
    store.dynamicSagas = {};

    // Tab registration
    tabs.forEach(tab => {
        if (tab.reducer) {
            console.log(`Registering reducer for tab ${tab.name}`);
            store.dynamicReducers[tab.key] = tab.reducer;
        }
        if (tab.saga) {
            console.log(`Running saga for tab ${tab.name}`);
            store.dynamicSagas[tab.name] = sagaMiddleware.run(tab.saga);
        }
    });

    store.replaceReducer(makeReducers(store.dynamicReducers));

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(makeReducers(store.dynamicReducers));
        });
    }
    return store;
}