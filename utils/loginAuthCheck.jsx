import {useQuery} from "react-query";
import axios from "axios";
import {useRecoilState} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState, accessTokenExpireState, refreshTokenExpireState} from "@/recoil/auth";
import {useRouter} from "next/router";
import {useState} from "react";
import {Cookies} from "react-cookie";
import moment from 'moment'

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
    const now = new Date()

    const initAuth = () => {
        setAccessToken('');
        setRefreshToken('');
        setAccessTokenExpire('');
        setRefreshTokenExpire('');
        setIsLogIn(false);
        router.push('/user/login');
    }

    function toLocalDateTimeFormat(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');  // 월은 0부터 시작하므로 1을 더하고, 두 자리 숫자를 유지하기 위해 앞에 '0'을 추가합니다.
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    const {data, isLoading, isError, refetch} = useQuery('loginAuthCheck', async () => {
        // 로그인 확인 제외 페이지
        if (currentPath === '/'
            || currentPath === '/user/login'
            || currentPath === '/user/join'
            || currentPath === '/error/403'
            || currentPath === '/error/500'
        ) {
            return true
        } else {
            if (!accessToken) {
                return router.push('/user/login')
            } else if (accessTokenExpire < toLocalDateTimeFormat(now)) { // 어세스토큰 만료시간 지났을 경우
                if (refreshToken && refreshTokenExpire > toLocalDateTimeFormat(now)) { // 리프레쉬토큰 만료시간이 아직 지나지 않앗을 경우
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_REISSUE}`,
                        {refreshToken: refreshToken},
                    ).then((res) => {
                        setAccessToken(res.data.accessToken)
                        setAccessTokenExpire(res.data.accessTokenExpiresAt)
                        refetch()
                    })
                } else { // 리프레쉬토큰 만료시간이 지났을 경우
                    initAuth()
                }
            }
        }
    });


    if (exceptPage) {
        return children
    } else if (!isLoading && !isError) {
        return children
    }
}