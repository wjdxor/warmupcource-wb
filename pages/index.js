import styles from '@/styles/Home.module.css'
import {useRecoilState} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState, tokenExpireState} from "@/recoil/auth";
import {useEffect, useState} from "react";
import {Cookies} from "react-cookie";

export default function Home() {

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
    const [expireAt, setExpireAt] = useRecoilState(tokenExpireState)
    const [isLogin, setIsLogin] = useRecoilState(isLoggedIn)
    const [userId, setUserId] = useRecoilState(isLoggedIn)

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    const handleLogout = () => {
        setAccessToken('')
        setRefreshToken('')
        setExpireAt('')
        setIsLogin(false)
        setUserId('')
        const cookies = new Cookies()
        cookies.remove('refreshToken')
    }
    return (
        <>
            <div className={styles.description}>
                <p>
                    Let's Warm up!!&nbsp;
                    <code className={styles.code}>Next.JS</code>
                </p>
                <div>
                    {mounted && isLogin ? (
                        <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Logout
                        </a>
                    ) : (
                        <a href="/user/login">
                            Login
                        </a>
                    )}
                </div>
            </div>
            <ul>
                <li><a href="/error/403">Go 403</a></li>
                <li><a href="/error/500">Go 500</a></li>
            </ul>
        </>
    )
}
