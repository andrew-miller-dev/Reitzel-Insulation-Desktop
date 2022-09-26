import { createStore, combineReducers } from 'redux'

import estimateReducer from './reducers/estimateReducer'
import addressReducer from './reducers/addressReducer'
import quoteReducer from './reducers/quoteReducer'
const reducers = {
    customerReducer: estimateReducer,
    addressReducer: addressReducer,
    quoteReducer: quoteReducer
}
const reducer = combineReducers(reducers)
const estimateStore = createStore(reducer)

export default estimateStore
