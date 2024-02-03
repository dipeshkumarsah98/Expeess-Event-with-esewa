-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "offerType" TEXT,
    "amount" INTEGER,
    "isPaid" BOOLEAN DEFAULT false,
    "transactionCode" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
