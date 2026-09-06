-- HPS website — initial schema for Turso (libSQL).
--
-- Prisma's migrate/db push commands cannot talk to Turso directly (it's
-- reached over HTTP, not the SQLite file protocol), so this file is applied
-- once, by hand, via the Turso CLI. It is the exact DDL Prisma generates for
-- this schema (prisma/schema.prisma) — dumped from a local `prisma db push`.
--
-- Usage, after creating your database with `turso db create hps-db`:
--   turso db shell hps-db < prisma/turso-init.sql
--
-- If you ever change prisma/schema.prisma, regenerate the matching SQL with:
--   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- and apply the new statements to Turso the same way (turso db shell will
-- error harmlessly on tables that already exist if you re-run this file).

CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

CREATE INDEX "ContactInquiry_status_idx" ON "ContactInquiry"("status");
