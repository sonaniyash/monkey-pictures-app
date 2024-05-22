-- CreateTable
CREATE TABLE "MonkeyPicture" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(2000) NOT NULL,
    "url" VARCHAR(500) NOT NULL,

    CONSTRAINT "MonkeyPicture_pkey" PRIMARY KEY ("id")
);
