import axios from "axios";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

export const getWeatherWithAlerts = async (req, res) => {
    const { location } = req.query;
    if (!location) return res.status(400).json({ message: "Location is required" });

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);
        const data = response.data;

        const weatherInfo = {
            location: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            alerts: []
        };

        // Determine alerts
        if (data.main.temp <= 2) {
            weatherInfo.alerts.push("Frost alert! Take protective measures for your crops.");
        }
        if (data.main.temp >= 40 || data.main.humidity <= 20) {
            weatherInfo.alerts.push("Heat/Drought alert! Ensure adequate irrigation.");
        }
        if (["Rain", "Thunderstorm", "Snow"].includes(data.weather[0].main)) {
            weatherInfo.alerts.push("Heavy Rain/Storm alert! Secure your crops.");
        }

        // Send email if alerts exist
        if (weatherInfo.alerts.length > 0) {
            const farmers = await User.find({ role: "farmer" });
            farmers.forEach(farmer => {
                sendEmail(
                    farmer.email,
                    "Weather Alert for Your Area",
                    `Dear ${farmer.name},\n\nWeather Alert for ${location}:\n- ${weatherInfo.alerts.join("\n- ")}\n\nStay safe!\nSmart Farmer`
                );
            });
        }

        res.status(200).json(weatherInfo);
    } catch (err) {
        console.error("Weather API error:", err.message);
        res.status(500).json({ message: "Failed to fetch weather", error: err.message });
    }
};
