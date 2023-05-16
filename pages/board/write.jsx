import styles from '@/styles/Home.module.css'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, isLoggedIn, refreshTokenState } from '@/recoil/auth';

export default function Write (){
    const router = useRouter();
    const [post, setPost] = useState({
        title: '',
        content: '',
        boardId: 1
    });
    
    const {title, content, boardId} = post;
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const checkLogIn = useRecoilValue(isLoggedIn);
    const refreshToken = useRecoilValue(refreshTokenState);
    const newPost = {
        title,
        content,
        boardId
    };
    
    useEffect(() => {
        if(!checkLogIn){
            router.push('/user/login');
        }
    });

    const onChange = (e) => {
        const{value, name} = e.target
        setPost({
            ...post,
            [name] : value,
        });
    } 
    
    const sendPost = useMutation('newPost', async () => {
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_POST_POST}`, newPost
            , {headers: {Authorization: `Bearer ${accessToken}`}})
        },
        {
            onSuccess: () => {
                console.log("Write success");
                setPost({
                    title: '',
                    content: ''
                });
                router.push('/board/posts');
            },
            onError: async (error) => {
                console.log("Write error "+error);
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
                            router.push('/user/login');
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

    const onSubmit = (e) =>{
        if (post){          
            

            sendPost.mutate(newPost);

        }else{
            console.log("무언가가 없다..!");
        }
    }
    
    return(
        <>
        <div className={styles.description}>
            <p onClick={() => router.push('/board/posts')}> 
                목록으로
            </p>
            <div>
                <a href="/">Home</a>
            </div>
        </div>
        <div>
            <div>
                <label htmlFor='title' >Title</label>&nbsp;
                <input  name="title"
                        id="title"
                        type="text" 
                        placeholder='제목을 입력하세요' 
                        value={post.title}
                        onChange={onChange}
                        style={{display:'flex', padding: '3px', margin:'5px 0 5px 0'}}
                        size={100}/>
            </div>
            <div>
                <label htmlFor='content' >Content</label>&nbsp;
                <textarea  name="content"
                           id="content"
                           type="text" 
                           placeholder='내용을 입력하세요' 
                           value={post.content}
                           onChange={onChange}
                           style={{display:'flex', resize: 'none', 
                                   padding: '3px', width: '100%', 
                                   height: '100px',margin:'5px 0 5px 0' }}
                           rows={5}/>
            </div>
            <button onClick={onSubmit}
                    style={{padding: '3px'}}>
                등록
            </button>
        </div>
        </>
    );
}