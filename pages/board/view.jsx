import styles from '@/styles/Home.module.css'
import { Margarine } from 'next/font/google';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postByIdSelector } from '@/recoil/boardPost';
import { accessTokenState } from '@/recoil/auth';

export default function View (){
    const router = useRouter();
    const { query } = useRouter();
    const id = query.id;

    const post = useRecoilValue(postByIdSelector(Number(id)));
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    //수정하기
    const onEdit = () => {
        router.push({
            pathname: "/board/edit",
            query: {id: id}
          })
    }

    //삭제하기
    const delPost = useMutation('post', async () => {
        return axios.delete(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_POST_POST+'/'+post.id}`
            , {headers: {Authorization: `Bearer ${accessToken}`}})
        },
        {
            onSuccess: () => {
                console.log("Delete success");
                router.push('/board/posts');
            },
            onError: async (error) => {
                console.log("Delete error");
                if (error.response.status === 401) {
                    console.log("401");
                    try {
                        const res = await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_REFRESH}`,
                            {refreshToken: refreshToken}
                        );
                        await setAccessToken(res.data.accessToken);
                        await refetch();
                    } catch (err) {
                        if (err.response?.status === 400) {
                            console.log("400");
                            setIsLogIn(false);
                            router.push('/user/login');
                        } else {
                            console.log("else에러");
                            console.error(err);
                        }
                    }
                } else {
                    alert("로그인이 필요합니다.");
                    setIsLogIn(false);
                    router.push('/user/login');
                }
            },
            retry: 0,
        }
    );

    const onDelet = () => {
        delPost.mutate(post);
    }

    return(
        <>
        <div className={styles.description}>
            <p onClick={() => router.back()}> 
                뒤로가기 
            </p>
            <div>
                <a href="/">Home</a>
            </div>
        </div>
        <div style={{textAlign: 'center'}}>
            <div style={{margin: '5px'}}>{post.title}</div>
            <hr/>
            <div style={{margin: '5px'}}>{post.content}</div>
            <div style={{marginTop: '20px'}}>
                <button onClick={onEdit}>수정하기</button>&nbsp;
                <button onClick={onDelet}>삭제하기</button>
            </div>
        </div>

        </>
    );
}