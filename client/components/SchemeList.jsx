"use client";
import { useState, useEffect } from "react";
import { fetchSchemes } from "../services/schemeService";

const SchemeList = () => {
    const [schemes, setSchemes] = useState([]);

    const loadSchemes = async () => {
        try {
            const data = await fetchSchemes();
            setSchemes(data.results || data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadSchemes();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Agriculture Schemes</h1>
            <ul className="space-y-2">
                {schemes.map((scheme) => (
                    <li key={scheme._id} className="border p-4 rounded">
                        <a href={scheme.link} target="_blank" className="text-blue-600 font-semibold">{scheme.name}</a>
                        <p>{scheme.description}</p>
                        <span className="text-sm italic">{scheme.category}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SchemeList;
