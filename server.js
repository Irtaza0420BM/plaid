require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PLAID_CLIENT_ID = 649313df0b4b6e00127961ce;
const PLAID_SECRET = 4943e9fe9d97f23de683394d5d785c;
const PLAID_ENV = sandbox;
const PORT = process.env.PORT || 5000;

app.get("/get_link_token", async (req, res) => {
  try {
    const response = await axios.post(
      `https://${PLAID_ENV}.plaid.com/link/token/create`,
      {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: { client_user_id: "unique-user-id" },
        client_name: "Auto Plaid Connect",
        country_codes: ["US"],
        language: "en",
        products: ["transactions"],
      }
    );

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: "Error generating link token" });
  }
});

app.post("/exchange_public_token", async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await axios.post(
      `https://${PLAID_ENV}.plaid.com/item/public_token/exchange`,
      {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token: public_token,
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: "Error exchanging public token" });
  }
});

app.get("/", (req, res) => {
  res.send(
    "Plaid API Server Running 🚀 - Use /get_link_token or /exchange_public_token"
  );
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
