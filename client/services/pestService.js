import api from "./api";

// Send image to backend for pest/disease detection
export const detectPest = async (formData) => {
    const res = await api.post("/detection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
