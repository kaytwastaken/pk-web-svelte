<script lang="ts">
    export let edit
    export let sys
    
    for ( let prop in sys.privacy ) {
        if ( sys.privacy[prop] == 'public' ) {
            sys.privacy[prop] = true
        } else if ( sys.privacy[prop] == 'private' ) {
            sys.privacy[prop] = false
        }
    }
</script>

<div>
    Privacy settings <br />
    (Checked is public):
    
    <span><input type="checkbox" bind:checked={sys.privacy.description_privacy} disabled={!edit} name="desc" id="desc" />
    <label for="desc"> Description</label></span>
    
    <span><input type="checkbox" bind:checked={sys.privacy.pronoun_privacy} disabled={!edit} name="prn" id="prn" />
    <label for="prn"> Pronouns</label></span>

    <span><input type="checkbox" bind:checked={sys.privacy.member_list_privacy} disabled={!edit} name="mem" id="mem" />
    <label for="mem"> Member List</label></span>
    
    <span><input type="checkbox" bind:checked={sys.privacy.group_list_privacy} disabled={!edit} name="grp" id="grp" />
    <label for="grp"> Group List</label></span>
    
    <span><input type="checkbox" bind:checked={sys.privacy.front_privacy} disabled={!edit} name="frnt" id="frnt" />
    <label for="frnt"> Current Fronters</label></span>

    <span><input type="checkbox" bind:checked={sys.privacy.front_history_privacy} disabled={!edit} name="frth" id="frth" />
    <label for="frth"> Front History</label></span>
</div>

<style lang='scss'>
    div {
        display: flex;
        flex-direction: column;
    }
</style>