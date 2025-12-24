import crypto from "crypto";

export function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
}

export function verifyMetaSignature(req) {
  const signature = req.get("X-Hub-Signature-256");
  if (!signature) throw new Error("Missing X-Hub-Signature-256");

  const expected = "sha256=" + crypto
    .createHmac("sha256", process.env.APP_SECRET)
    .update(req.rawBody || "")
    .digest("hex");

  // timing-safe compare
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);

  const isValid =
    sigBuf.length === expBuf.length &&
    crypto.timingSafeEqual(sigBuf, expBuf);

  if (!isValid) throw new Error("Invalid signature");
}
