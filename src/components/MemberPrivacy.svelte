<script>
    export let edit
    export let mem
    
    for ( let prop in mem.privacy ) {
        if ( mem.privacy[prop] == 'public' ) {
            mem.privacy[prop] = true
        } else if ( mem.privacy[prop] == 'private' ) {
            mem.privacy[prop] = false
        }
    }
</script>

<div>
    <!-- <span><input type="checkbox" bind:checked={mem.privacy.visibility ?? false} disabled={true} name="vis" id="vis" />
    <label for="vis"> Member visibility</label></span> -->

    Privacy settings <br />
    (Checked is public):
    
    <span><input type="checkbox" bind:checked={mem.privacy.visibility} disabled={!edit} name="vis" id="vis" />
    <label for="vis"> Visibility</label></span>
    
    <span> <input type="checkbox" bind:checked={mem.privacy.name_privacy} disabled={!edit} name="name" id="name" />
    <label for="name"> Name</label></span>
    
    <span><input type="checkbox" bind:checked={mem.privacy.description_privacy} disabled={!edit} name="desc" id="desc" />
    <label for="desc"> Description</label></span>
    
    <span><input type="checkbox" bind:checked={mem.privacy.bithday_privacy} disabled={!edit} name="dob" id="dob" />
    <label for="dob"> Birthday</label></span>
    
    <span><input type="checkbox" bind:checked={mem.privacy.pronoun_privacy} disabled={!edit} name="prn" id="prn" />
    <label for="prn"> Pronouns</label></span>
    
    <span><input type="checkbox" bind:checked={mem.privacy.avatar_privacy} disabled={!edit} name="pfp" id="pfp" />
    <label for="pfp"> Avatar</label></span>
    
    <span><input type="checkbox" bind:checked={mem.privacy.metadata_privacy} disabled={!edit} name="meta" id="meta" />
    <label for="meta"> Metadata</label></span>
</div>

<style lang='scss'>
    div {
        display: flex;
        flex-direction: column;
    }
</style>