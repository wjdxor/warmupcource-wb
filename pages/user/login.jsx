import styles from '@/styles/Home.module.css'
import {useRouter} from 'next/router';
import {useState} from "react";
import {useMutation} from "react-query";
import axios from "axios";
import {useRecoilState, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, isLoggedIn, userId, accessTokenExpireState, refreshTokenExpireState} from "@/recoil/auth";
import {Cookies} from "react-cookie";


export default function Login() {
    const router = useRouter();
    const cookies = new Cookies();

    const setAccessToken = useSetRecoilState(accessTokenState);
    const setRefreshToken = useSetRecoilState(refreshTokenState);
    const setUserId = useSetRecoilState(userId);
    const setAccessTokenExpire = useSetRecoilState(accessTokenExpireState);
    const setRefreshTokenExpire = useSetRecoilState(refreshTokenExpireState);

    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedIn);

    const [loginReg, SetLoginReg] = useState({
        loginId: '',
        loginPw: ''
    });

    const {loginId, loginPw} = loginReg;

    const onChangeLogin = (e) => {
        const {value, name} = e.target;
        SetLoginReg({
            ...loginReg,
            [name]: value,
        })
        console.log(loginReg)
    }

    const postLoginReg = useMutation(() => {
            return axios.post(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_LOGIN}`,
                {userId: loginReg.loginId, password: loginReg.loginPw})
        },
        {
            onSuccess: (data) => {
                setAccessToken(data.data.accessToken)
                setRefreshToken(data.data.refreshToken)
                setUserId(data.data.userId)
                setAccessTokenExpire(data.data.accessTokenExpiresAt)
                setRefreshTokenExpire(data.data.refreshTokenExpiresAt)
                setLoggedIn(true)
                cookies.set('refreshToken', data.data.refreshToken, {
                    sameSite: 'strict',
                    path: '/'
                })
                router.push('/');
                console.log(data);
            },
            onError: (error) => {
                alert(error.response.data.message);
            }
        }
    )

    // Refresh Token?

    const onClick = () => {
        postLoginReg.mutate()
        console.log("로그인버튼 클릭");
    }

    return (
        <>
            <div className={styles.description}>
                <p onClick={() => router.back()}>
                    뒤로가기
                </p>
                <div>
                    <a
                        href="/"
                    >
                        Home
                    </a>
                </div>
            </div>
            <div>
                <input type="text" name="loginId"
                       value={loginId} onChange={onChangeLogin}
                       placeholder="아이디를 입력하세요"
                       style={{padding: '3px', marginBottom: '10px', textAlign: 'center'}}/>
                <br/>
                <input type="password" name="loginPw"
                       value={loginPw} onChange={onChangeLogin}
                       placeholder="비밀번호를 입력하세요"
                       style={{padding: '3px', marginBottom: '15px', textAlign: 'center'}}/>
                <br/>
                <button onClick={onClick}
                        style={{textAlign: 'center', padding: '3px', margin: 'auto', display: 'block', width: '100%'}}>
                    로그인
                </button>
                <a href='/user/join' style={{fontSize: '11px'}}>회원가입</a>&nbsp;
                <a style={{fontSize: '11px', marginLeft: '20px'}}>아이디&비밀번호찾기</a>
            </div>
        </>
    );
}