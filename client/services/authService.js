const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
    }

    return res.json(); // will return user info + token
};

export const registerUser = async (name, email, password, role = "user") => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) throw new Error("Register failed");
    return res.json();
};
