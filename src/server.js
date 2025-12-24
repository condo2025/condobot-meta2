import express from "express";
import dotenv from "dotenv";
import { verifyWebhook } from "./verify.js";
import { verifyMetaSignature } from "./verify.js";
import { handleIncomingWebhook } from "./meta.js";

dotenv.config();

const app = express();

// Meta recomienda leer el raw body para verificar firma.
// Pero express.json() normal sirve si calculas con raw body.
// Aquí lo hacemos simple: guardamos rawBody con verify.
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf?.toString("utf8");
  }
}));

// Health check
app.get("/", (req, res) => res.status(200).send("CondoBot Meta webhook is running ✅"));

// 1) Verificación del Webhook (GET)
app.get("/webhook", verifyWebhook);

// 2) Recepción de eventos (POST)
app.post("/webhook", express.json({ verify: rawBodySaver }), (req, res) => {
    console.log("Webhook received");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // ✅ BYPASS SOLO PARA PRUEBA MANUAL
   if (process.env.NODE_ENV !== "production" && !req.headers["x-hub-signature-256"]) {
     return res.sendStatus(200);
   }

    // Verificación de firma (seguridad)
    verifyMetaSignature(req);

    // Procesar el evento
    handleIncomingWebhook(req.body);

    // Responder rápido 200
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.sendStatus(403);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 CondoBot server running on port ${port}`));
