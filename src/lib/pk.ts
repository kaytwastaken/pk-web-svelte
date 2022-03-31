import axios from 'axios';

const baseUrl = 'https://api.pluralkit.me/v2/'

const methods = ['get', 'post', 'patch', 'delete']
const noop = () => {}

export default function() {
    const route = []
    const handler = {
        get(_, name, reciever) {
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
            route.push(name)
            return reciever
        },
        apply(_, __, args) {
            route.push(...args.filter(x => x != null))
            return new Proxy(noop, handler)        
        }
    }
    return new Proxy(noop, handler)
}


// Code from https://github.com/Draconizations/pk-webs-svelte (MIT License)
import * as errors from './errors';

function parseData(code: number, data: any) {
    if (code == 200) return data
    if (code == 204) return;
    throw errors.parse(code, data);
}