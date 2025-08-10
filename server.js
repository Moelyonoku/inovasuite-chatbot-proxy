import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Deteksi pertanyaan kompleks (hybrid logic)
    const isComplex = message.length > 150 || /analisis|proposal|strategi|teknis|coding/i.test(message);
    const model = isComplex ? "gpt-4o" : "gpt-3.5-turbo";

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content, model });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
