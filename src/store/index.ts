import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import basketReducer from "./slices/basketSlice";
import orderReducer from "./slices/orderSlice";
import categoriesSlice from "./slices/categoriesSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    basket: basketReducer,
    order: orderReducer,
    categories: categoriesSlice,
  },
});

// Store turlarini eksport qilish
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
