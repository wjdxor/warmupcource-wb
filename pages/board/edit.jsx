import styles from '@/styles/Home.module.css'
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState } from '@/recoil/auth';
import { postByIdSelector } from '@/recoil/boardPost';

export default function Edit (){
    const router = useRouter();
    const { query } = useRouter();
    const thisId = query.id;

    const [post, setPost] = useState({
        title: '',
        content: '',
        id:''
    });

    const editPost = useRecoilValue(postByIdSelector(Number(thisId)));
    const {title, content, id} = post;
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    const newPost = {
        title,
        content,
        id
    };
    
    const postSetting = useCallback(() => {
        if(editPost){
            setPost(post => ({
                ...post,
                title: editPost.title,
                content: editPost.content,
                id: editPost.id
            }))
        }
    },[])
    
    useEffect(() => {
        postSetting();
    }, [postSetting]);

    const onChange = (e) => {
        console.log(e.target)
        const{value, name} = e.target
        setPost({
            ...post,
            [name] : value,
        });
    } 

    const putPost = useMutation('newPost', async () => {
        return axios.put(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_POST_POST+'/'+newPost.id}`, newPost
            , {headers: {Authorization: `Bearer ${accessToken}`}})
        },
        {
            onSuccess: () => {
                console.log("Edit success");
                setPost({
                    title: '',
                    content: '',
                    id:''
                });
                router.push('/board/posts');
            },
            onError: async () => {
                console.log("Edit error");
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
        }
    );


    const onSubmit = (e) =>{
        if (post){
            putPost.mutate(newPost);
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
                        value={title}
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
                           value={content}
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