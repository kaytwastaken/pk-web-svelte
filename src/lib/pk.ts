import axios from 'axios';

const baseUrl = 'https://api.pluralkit.me/v2/'

const methods = ['get', 'post', 'patch', 'delete']
// Declare noop as a dummy function for the Proxy
const noop = () => {}

// Proxy object docs
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

// Export defaul function to be imported from '$lib/pk'
export default function() {
    // Empty route
    const route = []
    // Define handlers for the proxy objkect
    const handler = {
        // Overwrite basic response to proxy.xyz with get() trap
        get(_, name, reciever) {
            // If methods array contains the call on the proxy object make the API request
            if (methods.includes(name)) {
                return ({ data = undefined, auth = true, token = null, query = null } = {}) => new Promise((res, rej) => axios({
                    url: `${baseUrl}${route.join('/')}`,
                    method: name,
                    headers: {
                        authorization: token ?? (auth ? localStorage.getItem("pk-token") : undefined),
                        // "content-type": name == "get" ? undefined : "application/json"
                    },
                    data: !!data ? JSON.stringify(data) : undefined,
                    validateStatus: () => true,
                }).then((resp) => res(parseData(resp.status, resp.data))).catch(rej));
                
            }
            // Else add the call on the proxy object to the route
            route.push(name)
            // Return the proxy (functionally the same as new Proxy(noop, handler), reciever references itself)
            return reciever
        },
        // Overwrite basic response to a function call on the proxy object with the apply() trap
        apply(_, __, args) {
            // Add all call arguments that aren't null to the route
            route.push(...args.filter(x => x != null))
            // Return a proxy with noop and this handler (functionally the same as return reciever)
            return new Proxy(noop, handler)        
        }
    }
    // Return the new proxy after declaring the handlers
    return new Proxy(noop, handler)
}


// Code from https://github.com/Draconizations/pk-webs-svelte (MIT License)
import * as errors from './errors';

function parseData(code: number, data: any) {
    if (code == 200) return data
    if (code == 204) return;
    throw errors.parse(code, data);
}