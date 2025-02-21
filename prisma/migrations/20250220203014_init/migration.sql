-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lettersAlpha" TEXT NOT NULL,
    "lettersScrabbled" TEXT NOT NULL,
    "knownSolution" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuzzleSolution" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "puzzleID" TEXT NOT NULL,
    "boardState" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuzzleSolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PuzzleSolution_userID_puzzleID_key" ON "PuzzleSolution"("userID", "puzzleID");

-- AddForeignKey
ALTER TABLE "PuzzleSolution" ADD CONSTRAINT "PuzzleSolution_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleSolution" ADD CONSTRAINT "PuzzleSolution_puzzleID_fkey" FOREIGN KEY ("puzzleID") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
