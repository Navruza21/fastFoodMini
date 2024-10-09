import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@srctypes";

const ProductsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {
    setProducts: (
      state: { products: Product[] },
      action: PayloadAction<Product[]>
    ) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = ProductsSlice.actions;
export default ProductsSlice.reducer;
