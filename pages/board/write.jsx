import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { boardPosts } from '@/recoil/boardPost';
import { accessTokenState } from '@/recoil/auth';

export default function Write (){
    const router = useRouter();

    const [post, setPost] = useState({
        title: '',
        content: '',
        boardId: 1
    });
    
    const {title, content, boardId} = post;
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    const onChange = (e) => {
        const{value, name} = e.target
        setPost({
            ...post,
            [name] : value,
        });
    } 

    const sendPost = useMutation((newPost) => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_POST_POST}`, newPost
        , {headers: {Authorization: `Bearer ${accessToken}`}})}
        , {
        onSuccess: () => {
            setPost({
                title: '',
                content: ''
              });

            router.push('/board/posts');
        },
        onError: () => {
            alert("실패");
        }
    })

    const onSubmit = (e) =>{
        if (post){          
            const newPost = {
                title,
                content,
                boardId
            };

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