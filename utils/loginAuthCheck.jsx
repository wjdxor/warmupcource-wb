import {useQuery} from "react-query";
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {useRecoilState} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState} from "@/recoil/auth";
import {useRouter} from "next/router";

export default function LoginAuthCheck({component: Component, pageProps}) {

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
    const [isLogIn, setIsLogIn] = useRecoilState(isLoggedIn)
    const router = useRouter();

    const initAuth = () => {
        setAccessToken('');
        setRefreshToken('');
        setIsLogIn(false);
        router.push('/user/login');
    }

    const {data, refetch} = useQuery('loginAuthCheck', () => {
            console.log("accessToken: " + accessToken)
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
                }
            },
            retry: 0,
            onSuccess: () => {
                return <Component {...pageProps} />
            }
        },
    );


    return data && <Component {...pageProps} />
}