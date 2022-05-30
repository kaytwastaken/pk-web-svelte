<script>
    export let edit
    export let grp
    
    for ( let prop in grp.privacy ) {
        if ( grp.privacy[prop] == 'public' ) {
            grp.privacy[prop] = true
        } else if ( grp.privacy[prop] == 'private' ) {
            grp.privacy[prop] = false
        }
    }
</script>

<div>
    Privacy settings <br />
    (Checked is public):
    
    <span><input type="checkbox" bind:checked={grp.privacy.visibility} disabled={!edit} name="vis" id="vis" />
    <label for="vis"> Visibility</label></span>
    
    <span> <input type="checkbox" bind:checked={grp.privacy.name_privacy} disabled={!edit} name="name" id="name" />
    <label for="name"> Name</label></span>
    
    <span><input type="checkbox" bind:checked={grp.privacy.description_privacy} disabled={!edit} name="desc" id="desc" />
    <label for="desc"> Description</label></span>
    
    <span><input type="checkbox" bind:checked={grp.privacy.icon_privacy} disabled={!edit} name="pfp" id="pfp" />
    <label for="pfp"> Avatar</label></span>
    
    <span><input type="checkbox" bind:checked={grp.privacy.list_privacy} disabled={!edit} name="meta" id="meta" />
    <label for="meta"> Member List</label></span>
    
    <span><input type="checkbox" bind:checked={grp.privacy.metadata_privacy} disabled={!edit} name="meta" id="meta" />
    <label for="meta"> Metadata</label></span>
</div>

<style lang='scss'>
    div {
        display: flex;
        flex-direction: column;
    }
    input {
        margin: auto 0 auto 0;
    }
    label {
        margin-left: .25rem;
    }
</style>