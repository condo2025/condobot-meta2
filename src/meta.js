import axios from "axios";

const GRAPH_VERSION = "v21.0"; // puedes ajustar luego

export function handleIncomingWebhook(body) {
  // Estructura típica de Meta
  // body.entry[0].changes[0].value.messages[0]
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const messages = value?.messages;
    if (!messages || !messages.length) return;

    const msg = messages[0];
    const from = msg.from; // número del residente
    const text = msg.text?.body || "";

    console.log("📩 Incoming:", { from, text });

    // Respuesta demo (luego lo conectas a tu lógica/FAQs)
    if (/amenities|gym|pool|hours|horario/i.test(text)) {
      sendText(from, "🏢 Amenities Hours: Gym 6am–10pm | Pool 8am–8pm. ¿Quieres el reglamento completo?");
    } else if (/package|paquete/i.test(text)) {
      sendText(from, "📦 Packages: Puedes recoger en recepción 9am–6pm. ¿Tu unidad y apellido para confirmarte?");
    } else {
      sendText(from, "Hola 👋 Soy CondoBot. Escribe: \n1) Amenities\n2) Paquetes\n3) Parking\n4) Reglamento\n\nO dime tu pregunta en 1 frase.");
    }
  } catch (e) {
    console.error("handleIncomingWebhook error:", e.message);
  }
}

export async function sendText(to, message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    console.log("✅ Sent:", resp.data);
  } catch (err) {
    console.error("❌ sendText error:", err.response?.data || err.message);
  }
}
