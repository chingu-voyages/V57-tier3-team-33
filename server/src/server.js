 import express from "express";

// testing server 
 const port = 3200;

 const app = express();


 app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
