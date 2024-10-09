import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@srctypes";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
  },
  reducers: {
    setCategory: (
      state: { category: Category[] },
      action: PayloadAction<Category[]>
    ) => {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;
