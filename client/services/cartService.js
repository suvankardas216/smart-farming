import api from "./api";

// Clear the user's cart
export const clearCart = async () => {
    return await api.delete("/cart/clear");
};
