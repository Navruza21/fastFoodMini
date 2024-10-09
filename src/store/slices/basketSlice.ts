import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@srctypes";

const BasketSlice = createSlice({
  name: "basket",
  initialState: {
    basket: [],
  },
  reducers: {
    clearBasket: (state: { basket: Product[] }) => {
      state.basket = [];
    },
    setBasket: (
      state: { basket: Product[] },
      action: PayloadAction<Product[]>
    ) => {
      state.basket = action.payload;
    },
  },
});

export const { setBasket, clearBasket } = BasketSlice.actions;
export default BasketSlice.reducer;
