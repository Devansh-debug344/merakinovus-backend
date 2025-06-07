// index.js
import express from "express"
import cors from "cors"
import  dotenv  from "dotenv";
dotenv.config();

import contactRoute from "./routes/contact.js"
import chatAI from "./routes/chatbot.js"

const app = express();
app.use(cors());
app.use(express.json());

// Mount route
app.use("/contact", contactRoute);
app.use("/chat" , chatAI)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
