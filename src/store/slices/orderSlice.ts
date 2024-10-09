import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@srctypes";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
  },
  reducers: {
    setOrder: (state: { order: Order[] }, action: PayloadAction<Order[]>) => {
      state.order = action.payload;
    },
  },
});

export const { setOrder } = OrderSlice.actions;
export default OrderSlice.reducer;
