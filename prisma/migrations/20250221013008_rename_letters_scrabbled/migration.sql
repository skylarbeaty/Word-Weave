/*
  Warnings:

  - You are about to drop the column `lettersScrabbled` on the `Puzzle` table. All the data in the column will be lost.
  - Added the required column `lettersScrambled` to the `Puzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Puzzle" RENAME COLUMN "lettersScrabbled" TO "lettersScrambled";
