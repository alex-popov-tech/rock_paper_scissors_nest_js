-- CreateEnum
CREATE TYPE "Option" AS ENUM ('ROCK', 'PAPER', 'SCISSORS', 'LEAVE');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('DRAW', 'WIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" SERIAL NOT NULL,
    "firstPlayerId" INTEGER NOT NULL,
    "firstPlayerOption" "Option",
    "secondPlayerId" INTEGER,
    "secondPlayerOption" "Option",
    "winnerId" INTEGER,
    "winnerOption" "Option",
    "status" "GameStatus" NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_firstPlayerId_fkey" FOREIGN KEY ("firstPlayerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_secondPlayerId_fkey" FOREIGN KEY ("secondPlayerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
