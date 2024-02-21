import { Router } from "express";
import successResponse from "../utils/successResponse.js";
import ValidationError from "../errors/validationError.error.js";
import createSignature from "../utils/signature.js";
import handleEsewaSuccess from "../middleware/handleEsewaSuccess.js";
import db from "../config/db.config.js";
import {
  sendOrderComplete,
  sendWelcome,
  sendPaymentComplete,
} from "../services/mailer.service.js";

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  sendWelcome({
    email: "wileh43397@huizk.com",
  });
  sendOrderComplete({
    name: "dipesh",
    email: "wileh43397@huizk.com",
    orderId: "123",
  });

  res.json(
    successResponse(200, "Ok", "Welcome to msg send to dipesh@mailinator.com")
  );
});

apiRouter.post("/create/order", async (req, res) => {
  console.log(req.body);
  // address       String?
  // height        String?
  // weight        String?
  // contactNumber String?
  if (
    !req.body.amount ||
    !req.body.name ||
    !req.body.email ||
    !req.body.offerType ||
    !req.body.address ||
    !req.body.height ||
    !req.body.weight ||
    !req.body.phone
  ) {
    throw new ValidationError(
      "Invalid request body, Please provide all the required fields ( amount, name, email, offerType, address, height, weight, phone )",
      "Invalid Request"
    );
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:8000";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  try {
    const user = await db.user.create({
      data: {
        amount: req.body.amount,
        name: req.body.name,
        email: req.body.email,
        isPaid: false,
        offerType: req.body.offerType,
        address: req.body.address,
        height: req.body.height,
        weight: req.body.weight,
        contactNumber: req.body.phone,
      },
    });

    const uuid = user.id;

    const signature = createSignature(
      `total_amount=${req.body.amount},transaction_uuid=${uuid},product_code=EPAYTEST`
    );
    const formData = {
      amount: req.body.amount,
      failure_url: clientUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      // success_url: `${baseUrl}/api/v1/esewa/success`,
      success_url: `${clientUrl}/success`,
      tax_amount: "0",
      total_amount: req.body.amount,
      transaction_uuid: uuid,
    };

    res.json(successResponse(200, "Ok", { Product: req.body, formData }));
  } catch (error) {
    throw new ValidationError("Error Occured", error);
  }
});

apiRouter.get("/esewa/success", handleEsewaSuccess, async (req, res) => {
  try {
    const { transaction_uuid, transaction_code } = req;
    const user = await db.user.update({
      where: {
        id: transaction_uuid,
      },
      data: {
        isPaid: true,
        transactionCode: transaction_code,
      },
    });
    res.json(successResponse(200, "Ok", user));
  } catch (error) {
    throw new ValidationError("Error Occured", error);
  }
});

apiRouter.get("/records", async (req, res) => {
  try {
    const result = await db.user.groupBy({
      by: ["offerType"],
      _count: {
        _all: true,
      },
      where: {
        isPaid: false,
        offerType: {
          not: null,
        },
      },
    });
    res.json(successResponse(200, "Ok", result));
  } catch (error) {
    throw new ValidationError("Error Occured", error);
  }
});

export default apiRouter;
