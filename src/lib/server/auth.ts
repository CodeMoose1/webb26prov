import { getRequestEvent } from "$app/server";
import { db } from "../../prisma/db";
import { hashToken } from "./session";

export async function getUser() {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token")
  if (!token) return null
  const user = await db.orm.public.User.where({ tokenHash: hashToken(token) }).first()
  if (!user) return null
  return user

  // TODO: flytta hit koden från +layout.server.ts som hämtar sessionen,
  // kollar att den inte gått ut, och hämtar användaren
  // returnera användaren, eller null om något inte stämmer
}