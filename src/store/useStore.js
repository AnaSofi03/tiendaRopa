import { create } from "zustand";

const useStore = create((set) => {
  const storedUser = localStorage.getItem("user");
  const storedCart = localStorage.getItem("cart");
  const initialCart = storedCart ? JSON.parse(storedCart) : [];

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    setUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },
    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      set({ user: null, cart: [] });
    },

    cart: initialCart,

    addToCart: (producto) => {
      set((state) => {
        const index = state.cart.findIndex((p) => p.id === producto.id);
        let newCart;
        if (index === -1) {
          newCart = [...state.cart, { ...producto, cantidad: 1 }];
        } else {
          newCart = state.cart.map((p, i) =>
            i === index ? { ...p, cantidad: p.cantidad + 1 } : p
          );
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        return { cart: newCart };
      });
    },

    removeFromCart: (id) => {
      set((state) => {
        const newCart = state.cart.filter((p) => p.id !== id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        return { cart: newCart };
      });
    },

    clearCart: () => {
      localStorage.removeItem("cart");
      set({ cart: [] });
    },
  };
});

export default useStore;



