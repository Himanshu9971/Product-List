import { configureStore } from '@reduxjs/toolkit';
import reducers from './ReduxSlice';

const store = configureStore({
  reducer: {
    signUpForm: reducers.signUpForm,
    auth: reducers.auth,
  },
});

export default store;
