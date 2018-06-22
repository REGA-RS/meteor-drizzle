import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import todos from './layouts/todos/TodoReducers'
import user from './layouts/login/LoginReducers'

const reducer = combineReducers({
  routing: routerReducer,
  todos,
  user,
  ...drizzleReducers
})

export default reducer
