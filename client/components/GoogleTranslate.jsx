import { useState } from "react";
import google from "../src/assets/google.svg";

const GoogleTranslateButton = () => {
    const [open, setOpen] = useState(false);

    const handleTranslate = (lang) => {
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
            combo.value = lang;
            combo.dispatchEvent(new Event("change"));
        }
        setOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">

            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-800 transition"
            >
                <img src={google} alt="google" className="h-6 w-6" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute bottom-16 right-0 bg-black text-white shadow-xl rounded-xl p-2 space-y-2 w-40 animate-[fadeInUp_0.2s_ease-in-out]">
                    <button
                        onClick={() => handleTranslate("en")}
                        className="w-full px-3 py-2 rounded-lg hover:bg-gray-800 text-left"
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleTranslate("hi")}
                        className="w-full px-3 py-2 rounded-lg hover:bg-gray-800 text-left"
                    >
                        हिंदी
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoogleTranslateButton;
