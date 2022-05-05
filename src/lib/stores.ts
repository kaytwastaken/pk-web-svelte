import { writable } from "svelte/store";

export const loggedIn = writable(false)

export const currentUser = writable(null)

export const memberList = writable([])

export const deleteFlow = writable({visibility: false, member: null})