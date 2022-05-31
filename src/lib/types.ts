// Define types used to data parsing and representation, copied from pk-web

export type SysPrivacy ={
    description_privacy: string
    pronoun_privacy: string
    member_list_privacy: string
    group_list_privacy: string
    front_privacy: string
    front_history_privacy: string
}

export type System = {
    id: string
    uuid: string
    name: string
    description: string
    tag: string
    avatar_url: string
    banner: string
    color: string
    created: Date
    pronouns: string
    privacy: SysPrivacy
}

export interface WriteSystem {
    name: string
    description: string
    tag: string
    avatar_url: string
    banner: string
    color: string
    pronouns: string
    privacy?: SysPrivacy
}

export type ProxyTag = {
    prefix: string
    suffix: string
}

export type MemPrivacy = {
    visibility: string
    name_privacy: string
    description_privacy: string
    bithday_privacy: string
    pronoun_privacy: string
    avatar_privacy: string
    metadata_privacy: string
}

export type Member = {
    id: string
    uuid: string
    name: string
    display_name: string
    color: string
    birthday: string
    pronouns: string
    avatar_url: string
    banner: string
    description: string
    created: Date
    proxy_tags: Array<ProxyTag>
    keep_proxy: boolean
    privacy: MemPrivacy
}

export interface WriteMember {
    name: string
    display_name: string
    color: string
    birthday: string
    pronouns: string
    avatar_url: string
    banner: string
    description: string
    proxy_tags: Array<ProxyTag>
    privacy: MemPrivacy
}

export type GrpPrivacy = {
    visibility: string
    name_privacy: string
    description_privacy: string
    icon_privacy: string
    list_privacy: string
    metadata_privacy: string
}

export type Group = {
    id: string
    uuid: string
    name: string
    display_name: string
    description: string
    icon: string
    banner: string
    color: string
    members: Array<string>
    privacy: GrpPrivacy
}

export interface WriteGroup {
    name: string
    display_name: string
    description: string
    icon: string
    banner: string
    color: string
    members: Array<string>
    privacy: GrpPrivacy
}
// write grp