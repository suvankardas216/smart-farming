import { useState, useEffect } from "react";

const SchemeForm = ({ onSubmit, scheme }) => {
    const [name, setName] = useState(scheme?.name || "");
    const [description, setDescription] = useState(scheme?.description || "");
    const [link, setLink] = useState(scheme?.link || "");
    const [category, setCategory] = useState(scheme?.category || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !description || !link || !category) return alert("All fields required");
        onSubmit({ name, description, link, category });
        setName(""); setDescription(""); setLink(""); setCategory("");
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" placeholder="Scheme Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Income Support">Income Support</option>
                <option value="Insurance & Risk Management">Insurance & Risk Management</option>
                <option value="Energy & Technology">Energy & Technology</option>
                <option value="Infrastructure Development">Infrastructure Development</option>
                <option value="Organic & Sustainable Farming">Organic & Sustainable Farming</option>
                <option value="Credit & Finance">Credit & Finance</option>
                {/* Add all categories */}
            </select>
            <button type="submit">{scheme ? "Update" : "Create"} Scheme</button>
        </form>
    );
};

export default SchemeForm;
