import { createStore, combineReducers } from 'redux'

import estimateReducer from './reducers/estimateReducer'
import addressReducer from './reducers/addressReducer'
import quoteReducer from './reducers/quoteReducer'
import offlineReducer from './reducers/offlineReducer'
const reducers = {
    customerReducer: estimateReducer,
    addressReducer: addressReducer,
    quoteReducer: quoteReducer,
    offlineReducer: offlineReducer
}
const reducer = combineReducers(reducers)
const estimateStore = createStore(reducer)

export default estimateStore
