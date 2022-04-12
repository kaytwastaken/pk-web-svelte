import { loggedIn, currentUser } from '../stores';
import pk from '$lib/pk';

export async function login(token) {
    // Try logging in using the token in memory and storing it in localStorage
    try {
        localStorage.setItem('token', token)
        console.log("token set")
        const res = await pk().systems('@me').get({ token })
        // Save currently logged in user to Svelte stores
        loggedIn.update(() => true)
        currentUser.update(() => res)

    // If the login fails tell the user and log it.
    } catch (error) {
        console.error(error.message)
        // Nuke the token and stores
        localStorage.removeItem('token')
        console.log("token nuked")
        loggedIn.update(() => false)
        currentUser.update(() => null)
        return error
    }
}

export function logout() {
    // Nuke the token and stores when a user logs out
    // token = '';
    localStorage.removeItem("token");
    // Clear the stores
    loggedIn.update(() => false);
    currentUser.update(() => null);
}