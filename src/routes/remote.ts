import { form, getRequestEvent, query } from "$app/server";
import * as v from 'valibot'
import { db } from "../prisma/db";
import { EventEmitter, on } from "node:events";
import { hashToken } from "#lib/server/session.ts";
import { redirect } from "@sveltejs/kit";
import { getUser } from "#lib/server/auth.ts";

let votes_for: Record<string, number> = {}
let votes_against: Record<string, number> = {}

const emitter = new EventEmitter();
emitter.setMaxListeners(0)

export const get_motions = query.live(async function*() {
    yield db.orm.public.Motion.include("votes").all()
    for await (const _ of on(emitter, "update_motions")) {
        yield db.orm.public.Motion.include("votes").all()
    }
})


export const create_motion = form(v.object({
    text: v.string()
}), async ({ text })=>{
    await db.orm.public.Motion.create({ text: text })
    emitter.emit("update_motions")
})

export const vote_yes = form(v.object({id: v.string()}), async ({ id })=>{
    return await vote(id, true)
})

export const vote_no = form(v.object({id: v.string()}), async ({ id })=>{
    return await vote(id, false)
})

async function vote(motion_id: string, value: boolean) {
    // validera login innan röstning kan ske
    const user = await getUser()
    if (!user) return {result: "user_invalid"}
    
    const motion = await db.orm.public.Motion.where({ id: motion_id }).first()
    if (!motion) return {result: "motion_invalid"}
    const previous_vote = await db.orm.public.Vote.where({ motion_id: motion_id, user_id: user.id }).first()
    if (previous_vote){
        if (previous_vote.value === value){
            await db.orm.public.Vote.where({ motion_id: motion_id, user_id: user.id }).delete()
        }
        else{
            await db.orm.public.Vote.where({ motion_id: motion_id, user_id: user.id }).update({ value: value })
        }
    } else {
        await db.orm.public.Vote.create({ value: value, user_id: user.id, motion_id: motion_id })
        
        //if (value)
            //await db.orm.public.Motion.where({ id: motion_id }).update({for: motion.for + 1})
        //else
            //await db.orm.public.Motion.where({ id: motion_id }).update({against: motion.against + 1})
    }

    //const votes = await db.orm.public.Vote.where({ motion_id: motion_id }).all()
    //const votes_for = votes.filter((vote)=>vote.value).length
    //const votes_against = votes.filter((vote)=>!vote.value).length
    //await db.orm.public.Motion.where({id: motion_id}).update({for: votes_for, against: votes_against})

    emitter.emit("new_vote")
    emitter.emit("update_motions")
    return {result: "accepted"}
}

export const get_votes = query.live(v.string(),
async function*(id){
    yield await db.orm.public.Vote.where({ motion_id: id}).include("user").all()
    for await (const _ of on(emitter, "new_vote")) {
        yield await db.orm.public.Vote.where({ motion_id: id}).include("user").all();
    }
})