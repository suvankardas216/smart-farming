import axios from "axios"
import Lab from "../models/LabModel.js"

// Helper - fetch address from Google Maps
const getAddressFromGoogle = async (lat, lon) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY
        const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: { latlng: `${lat},${lon}`, key: apiKey },
        })
        return res.data.results?.[0]?.formatted_address || "Unknown address"
    } catch (err) {
        console.error("Google Maps error:", err.message)
        return "Unknown address"
    }
}

// GET Labs by city + type
export const getLabsByCity = async (req, res) => {
    const { city, type } = req.query
    if (!city || !type) {
        return res.status(400).json({ error: "City and type are required" })
    }

    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY

        // Step 1: Get city coordinates
        const geocodeRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: { address: city, key: apiKey },
        })

        if (!geocodeRes.data.results?.length) {
            return res.status(404).json({ error: "City not found" })
        }

        const { lat, lng } = geocodeRes.data.results[0].geometry.location

        // Step 2: Query Google Places (soil or water test lab)
        const query =
            type === "soil" ? `soil testing lab in ${city}` : `water testing lab in ${city}`

        const placesRes = await axios.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            {
                params: {
                    query,
                    location: `${lat},${lng}`,
                    radius: 50000,
                    key: apiKey,
                },
            }
        )

        const labs = placesRes.data.results.map((place) => ({
            id: place.place_id,
            name: place.name,
            city,
            address: place.formatted_address,
            type,
            location: place.geometry?.location || null,
            rating: place.rating || null,
        }))

        res.status(200).json(labs)
    } catch (err) {
        console.error("Google API error (getLabsByCity):", err.message)
        if (err.response) {
            console.error("Google API Response:", err.response.data)
        }
        res.status(500).json({ error: "Failed to fetch labs from Google Maps" })
    }
}
