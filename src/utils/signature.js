import crypto from "crypto";

const createSignature = (message) => {
  const secret = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
  console.log("🚀 ~ createSignature ~ secret:", secret);

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

export default createSignature;
