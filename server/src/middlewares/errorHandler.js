export const errorHandler = (error, _req, res, _next) => {
    console.log(error)
    if (error.status === 404 || error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
    };

    return res.status(500).json({ message: error.message || "Internal server error" });
};