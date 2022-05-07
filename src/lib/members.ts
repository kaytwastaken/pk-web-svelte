export function deleteProxy (index, mem) {
    // Delete the specified proxy object and update the objects
    mem.proxy_tags.splice(index, 1)
    return mem.proxy_tags
}

export function addProxy (mem) {
    // Create a blank proxy object and update the objects
    mem.proxy_tags.push({prefix: '', suffix: ''})
    return mem.proxy_tags
}