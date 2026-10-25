import { EMPTY_CONTACT, type CartItemData, type ContactData } from "@/types";

export interface CartState {
  items: CartItemData[];
  contact: ContactData;
}

export const INITIAL_CART: CartState = { items: [], contact: EMPTY_CONTACT };

export type CartAction =
  | { type: "hydrate"; state: CartState }
  | { type: "add"; item: CartItemData }
  | { type: "update"; item: CartItemData }
  | { type: "remove"; id: string }
  | { type: "setContact"; contact: Partial<ContactData> }
  | { type: "clearItems" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "update":
      return { ...state, items: state.items.map((i) => (i.id === action.item.id ? action.item : i)) };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "setContact":
      return { ...state, contact: { ...state.contact, ...action.contact } };
    case "clearItems":
      return { ...state, items: [] };
  }
}