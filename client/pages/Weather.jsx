import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WeatherWidget from "../components/WeatherWidget";

const Weather = () => {
    return (
        <div>
            
            <main className="">
                <WeatherWidget />
            </main>
            
        </div>
    );
};

export default Weather;
