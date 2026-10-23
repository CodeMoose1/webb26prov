import { form, getRequestEvent } from "$app/server"
import { randomBytes, verify } from "node:crypto";
import * as v from 'valibot'
import { db } from "../../prisma/db";
import { verifyPassword } from "../../lib/server/password";
import { hashToken } from "../../lib/server/session";
import { redirect } from "@sveltejs/kit";

export const login = form(v.object({
    username: v.pipe(v.string(), v.nonEmpty()),
    _password: v.pipe(v.string(), v.nonEmpty())
}), async ({ username, _password }) => {

    const user = await db.orm.public.User.where({username: username}).first()
    if (!user || !verifyPassword(_password, user.passwordHash)) return { error: "Fel användarnamn eller lösenord" }

    const token = randomBytes(32).toString("hex");
    
    await db.orm.public.User.where({username: username}).update({ tokenHash: hashToken(token) })
    const { cookies } = getRequestEvent();
    cookies.set("token", token)
    redirect(303, "/")
})