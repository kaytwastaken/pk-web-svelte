<script>
    export let member
</script>

<div>
    <!-- <span><input type="checkbox" checked={member.privacy.visibility == 'true' ? true : false} disabled={true} name="vis" id="vis" />
    <label for="vis"> Member visibility</label></span> -->

    Privacy settings <br />
    (Checked is public):
    
    <span><input type="checkbox" checked={member.privacy.visibility == 'true' ? true : false} disabled={true} name="vis" id="vis" />
    <label for="vis"> Visibility</label></span>
    
    <span> <input type="checkbox" checked={member.privacy.name_privacy == 'true' ? true : false} disabled={true} name="name" id="name" />
    <label for="name"> Name</label></span>
    
    <span><input type="checkbox" checked={member.privacy.description_privacy == 'true' ? true : false} disabled={true} name="desc" id="desc" />
    <label for="desc"> Description</label></span>
    
    <span><input type="checkbox" checked={member.privacy.bithday_privacy == 'true' ? true : false} disabled={true} name="dob" id="dob" />
    <label for="dob"> Birthday</label></span>
    
    <span><input type="checkbox" checked={member.privacy.pronoun_privacy == 'true' ? true : false} disabled={true} name="prn" id="prn" />
    <label for="prn"> Pronouns</label></span>
    
    <span><input type="checkbox" checked={member.privacy.avatar_privacy == 'true' ? true : false} disabled={true} name="pfp" id="pfp" />
    <label for="pfp"> Avatar</label></span>
    
    <span><input type="checkbox" checked={member.privacy.metadata_privacy == 'true' ? true : false} disabled={true} name="meta" id="meta" />
    <label for="meta"> Metadata</label></span>
</div>

<style lang='scss'>
    div {
        display: flex;
        flex-direction: column;
    }
</style>