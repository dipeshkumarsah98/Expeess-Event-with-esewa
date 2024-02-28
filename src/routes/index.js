import { Router } from "express";
import { sendOrderComplete, sendResult } from "../services/mailer.service.js";
import successResponse from "../utils/successResponse.js";
import ValidationError from "../errors/validationError.error.js";
import createSignature from "../utils/signature.js";
import handleEsewaSuccess from "../middleware/handleEsewaSuccess.js";
import db from "../config/db.config.js";
import { createObjectCsvWriter } from "csv-writer";

const apiRouter = Router();

// apiRouter.get("/", async (req, res) => {
//   sendOrderComplete({
//     name: "dipesh",
//     email: "dipesh@mailinator.com",
//     orderId: "5k",
//   });

//   res.json(
//     successResponse(200, "Ok", "Welcome to msg send to wileh43397@huizk.com")
//   );
// });

const userLimit = {
  basic: 2024,
  gold: 400,
  premium: 200,
};
apiRouter.get("/get-records", async (req, res) => {
  const { offerType, isPaid } = req.query;
  let users;
  if (offerType) {
    users = await db.user.findMany({
      where: {
        offerType: offerType,
        isPaid: isPaid.toLocaleLowerCase() === "true" ? true : false,
      },
    });
  } else {
    users = await db.user.findMany({});
  }
  // Fetch users based on offerType from the database

  // CSV file path and name
  const filePath = `./${offerType}_users.csv`;

  // Setup the csv-writer
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "offerType", title: "Offer Type" },
      { id: "amount", title: "Amount" },
      { id: "isPaid", title: "Is Paid" },
      { id: "address", title: "Address" },
      { id: "height", title: "Height" },
      { id: "weight", title: "Weight" },
      { id: "contactNumber", title: "Contact Number" },
      { id: "transactionCode", title: "Transaction Code" },
    ],
    // Additional options can be set if required
  });

  // Write the data to the CSV file
  await csvWriter.writeRecords(users);

  sendResult({
    email: "subhashishjungshah@gmail.com",
    filePath: filePath,
  });

  // Set headers to trigger download
  // res.download(filePath, (err) => {
  //   if (err) {
  //     console.error("Error downloading the file", err);
  //     res.status(500).send("Error downloading the file");
  //   }
  //   // You may also want to delete the file after download if it's no longer needed
  // });
  res.send("Email with CSV file has been sent.");
});
apiRouter.post("/create/order", async (req, res) => {
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
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  try {
    const numberOfRecords = await db.user.groupBy({
      by: ["offerType"],
      _count: {
        _all: true,
      },
      where: {
        isPaid: true,
        offerType: {
          not: null,
        },
      },
    });

    // check where userLimit is exceeded comparing with the offerType
    if (numberOfRecords.length > 0) {
      const offerType = req.body.offerType.toLocaleLowerCase();
      // check offerType is valid or not
      const limitCount = userLimit[offerType];

      if (limitCount === undefined) {
        throw new ValidationError(
          `Invalid offer type ${offerType}`,
          "Invalid Offer Type"
        );
      }
      // find offer in the numberOfRecords
      const offerTypeCount = numberOfRecords.find(
        (record) => record.offerType.toLocaleLowerCase() === offerType
      );

      if (
        offerTypeCount !== undefined &&
        offerTypeCount._count._all >= limitCount
      ) {
        throw new ValidationError(
          `User limit exceeded for ${offerType} offer type`,
          "User Limit Exceeded"
        );
      }
    }

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
      `total_amount=${req.body.amount},transaction_uuid=${uuid},product_code=${productCode}`
    );
    const formData = {
      amount: req.body.amount,
      failure_url: clientUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: productCode,
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
    console.log(error.message);
    throw new ValidationError(error.message || "Error Occured", error);
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
    const { offerType } = user;
    let worth;
    if (offerType.toLocaleLowerCase() === "basic") {
      worth = "5k";
    } else if (offerType.toLocaleLowerCase() === "gold") {
      worth = "10k";
    } else {
      worth = "15k";
    }
    sendOrderComplete({
      name: user.name,
      email: user.email,
      orderId: worth,
    });

    res.json(successResponse(200, "Ok", user));
  } catch (error) {
    throw new ValidationError(error.message || "Error Occured", error);
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
        isPaid: true,
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
