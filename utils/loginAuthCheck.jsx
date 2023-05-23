import {useQuery} from "react-query";
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {useRecoilState} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState, tokenExpireState} from "@/recoil/auth";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function LoginAuthCheck({children}) {

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
    const [isLogIn, setIsLogIn] = useRecoilState(isLoggedIn)
    const [expireAt, setExpireAt] = useRecoilState(tokenExpireState)
    const [exceptPage, setExceptPage] = useState(false)

    const router = useRouter();
    const currentPath = router.pathname;

    const initAuth = () => {
        setAccessToken('');
        setRefreshToken('');
        setIsLogIn(false);
        router.push('/user/login');
    }

    // 로그인 체크를 하지 않을 페이지
    useEffect(() => {
        if (currentPath === '/user/login'
            || currentPath === ''
        ) {
            setExceptPage(true)
        }
    }, [currentPath])

    const {data, isLoading, isError, refetch} = useQuery('loginAuthCheck', () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/validate`
                , {headers: {Authorization: `Bearer ${accessToken}`}})
        },
        {
            onError: async (error) => {
                try {
                    console.log("refreshToken: " + refreshToken)
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_REFRESH}`,
                        {},
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

            retry: 0
        },
    );

    if (!isLoading && !isError || exceptPage) {
        return children
    }
}