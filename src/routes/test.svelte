<script lang="ts">

import { readable, sendable } from '$lib/birthday'

let date
let dateString
let input

function readableDate () {
    try {
        return readable(input)
    } catch (error) {
        return error
    }
}

function sendableDate () {
    try {
        return sendable(input)
    } catch (error) {
        return error
    }
}

</script>

<form on:submit|preventDefault={() => {date = readableDate(); dateString = sendableDate()}}>
    <input type="text" name="" id="" bind:value={input} style="color: red">
    <input type="submit" class="submit">
</form>

<h1>{date}</h1>
<h2>{dateString}</h2>