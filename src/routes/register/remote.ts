import { form } from "$app/server"
import * as v from 'valibot'
import { db } from "../../prisma/db"
import { hashPassword } from "../../lib/server/password";
import { redirect } from "@sveltejs/kit";

export const register = form(v.object({
    username: v.pipe(v.string(), v.nonEmpty()),
    _password: v.pipe(v.string(), v.nonEmpty())
}), async ({ username, _password })=>{
    await db.orm.public.User.create({ username: username, passwordHash: hashPassword(_password) })
    redirect(303, "/login")
})