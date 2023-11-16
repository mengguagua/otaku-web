import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';
import userReducer from './userSlice';
import thunk from 'redux-thunk';


export default configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
  },
  middleware: [thunk],
})
