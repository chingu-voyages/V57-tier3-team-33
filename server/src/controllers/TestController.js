import { fetchExample } from "../services/TestService.js"

export const testDatabase = async (req, res) => {
    try {
        const example = await fetchExample();
        res.status(200).json(example);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}