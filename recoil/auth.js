import { atom } from 'recoil';
import {recoilPersist} from "recoil-persist";

const {persistAtom} = recoilPersist();
export const accessTokenState = atom({
    key: 'accessToken',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const refreshTokenState = atom({
    key: 'refreshToken',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const tokenExpireState = atom({
    key: 'tokenExpire',
    default: '',
    effects_UNSTABLE: [persistAtom]
})


export const isLoggedIn = atom({
    key: 'isLoggedIn',
    default: false,
    effects_UNSTABLE: [persistAtom]
})

export const userId = atom({
    key: 'userId',
    default: '',
    effects_UNSTABLE: [persistAtom]
})