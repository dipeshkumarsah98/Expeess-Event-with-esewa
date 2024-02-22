import createSignature from "../utils/signature.js";

const handleEsewaSuccess = (req, res, next) => {
  try {
    const { data } = req.query;

    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    console.log(decodedData);
    if (decodedData?.status !== "COMPLETE") {
      return res.json({ message: "Payment Failed" });
    }

    const message = decodedData?.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");

    const signature = createSignature(message);
    if (signature !== decodedData?.signature) {
      res.json({ message: "Payment Failed" });
    }
    req.transaction_uuid = decodedData?.transaction_uuid;
    req.transaction_code = decodedData?.transaction_code;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error Occured" });
  }
};
export default handleEsewaSuccess;
