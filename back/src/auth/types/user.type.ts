export type User = {
    id: string,
    email: string,
    nickname: string,
    firstname: string,
    surname: string,
    avatar: string,
    hash: string,
    hashedRt: string,
    twoFactorAuthSecret: string,
	isTwoFactorAuthEnabled: boolean
}

export type GoogleUser = {
    id: string,
    email: string,
    nickname: string,
    firstName: string,
    lastName: string,
    picture: string,
}

export type MarvinUser = {
    id: string,
    email: string,
    nickname: string,
    first_name: string,
    last_name: string,
    image_url: string,
}