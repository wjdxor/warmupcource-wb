import {useQuery} from "react-query";
import axios from "axios";
import {useRecoilState} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState, accessTokenExpireState, refreshTokenExpireState} from "@/recoil/auth";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Cookies} from "react-cookie";

export default function LoginAuthCheck({children}) {

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
    const [isLogIn, setIsLogIn] = useRecoilState(isLoggedIn)
    const [accessTokenExpire, setAccessTokenExpire] = useRecoilState(accessTokenExpireState)
    const [refreshTokenExpire, setRefreshTokenExpire] = useRecoilState(refreshTokenExpireState)
    const [exceptPage, setExceptPage] = useState(false)
    const [checkRequiredPath, setCheckRequiredPath] = useState(false)

    const router = useRouter();
    const currentPath = router.pathname;
    const cookies = new Cookies()

    const initAuth = () => {
        setAccessToken('');
        setRefreshToken('');
        setAccessTokenExpire('');
        setRefreshTokenExpire('');
        setIsLogIn(false);
        router.push('/user/login');
    }

    // 로그인 체크를 하지 않을 페이지
    useEffect(() => {
        if (currentPath === '/user/login'
            || currentPath === '/'
            || currentPath === '/user/join'
        ) {
            setExceptPage(true);
            setCheckRequiredPath(false)
        } else {
            setExceptPage(false);
            setCheckRequiredPath(true)
        }
    }, [currentPath])

    const {data, isLoading, isError, refetch} = useQuery('loginAuthCheck', () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/validate`
                , {headers: {Authorization: `Bearer ${accessToken}`}})
        },
        {
            onError: async (error) => {
                try {
                    const res = await axios.post(
                        // `${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_REFRESH}`,
                        `${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_REISSUE}`,
                        {refreshToken: refreshToken},
                        {
                            withCredentials: true,
                        }
                    )
                    await setAccessToken(res.data.accessToken);
                    await refetch();
                } catch (err) {
                    initAuth()
                } finally {
                    if (!isLoading) {
                        return children;
                    }
                }
            },
            retry: 0,
            enabled: checkRequiredPath
        },
    );

    if (exceptPage) {
        return children
    } else if (!isLoading && !isError) {
        return children
    }
}