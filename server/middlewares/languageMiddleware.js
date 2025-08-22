import fs from "fs";
import path from "path";

const localesDir = path.join(process.cwd(), "locales");

export const languageMiddleware = (req, res, next) => {
    const lang = req.headers["accept-language"] || "en"; // default English
    const filePath = path.join(localesDir, `${lang}.json`);

    if (fs.existsSync(filePath)) {
        req.lang = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
        req.lang = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf-8"));
    }
    next();
};
