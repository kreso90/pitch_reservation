/*
  Warnings:

  - You are about to drop the column `reservationDate` on the `FieldReservation` table. All the data in the column will be lost.
  - You are about to drop the column `reservationTime` on the `FieldReservation` table. All the data in the column will be lost.
  - Added the required column `reservationEndTime` to the `FieldReservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationStartTime` to the `FieldReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FieldReservation" DROP COLUMN "reservationDate",
DROP COLUMN "reservationTime",
ADD COLUMN     "reservationEndTime" TIMESTAMPTZ(2) NOT NULL,
ADD COLUMN     "reservationStartTime" TIMESTAMPTZ(2) NOT NULL;
