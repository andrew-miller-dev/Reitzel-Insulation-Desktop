import { createStore, combineReducers } from 'redux'

import estimateReducer from './reducers/estimateReducer'
import addressReducer from './reducers/addressReducer'
const reducers = {
    customerReducer: estimateReducer,
    addressReducer: addressReducer
}
const reducer = combineReducers(reducers)
const estimateStore = createStore(reducer)

export default estimateStore
