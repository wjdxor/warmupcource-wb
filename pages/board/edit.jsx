import styles from '@/styles/Home.module.css'
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';

export default function Edit (){
    const router = useRouter();
    const { query } = useRouter();
    const editPost = JSON.parse(query.post);

    const [post, setPost] = useState({
        title: '',
        content: '',
        boardId: 1
    });
    
    const {title, content, boardId} = post;

    const postSetting = useCallback(() => {
        if(editPost){
            setPost(post => ({
                ...post,
                title: editPost.title,
                content: editPost.content,
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

    const putPost = useMutation((newPost) => {
        axios.put(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_PUT_POST}`, newPost)}
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
        if (post.title && post.content){
            console.log(post)
            
            const newPost = {
                title,
                content,
                boardId
            };
            
            console.log("뉴확인: " + newPost.boardId + " " + newPost.title + " " + newPost.content);

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
                <label htmlFor='title' style={{textAlign: 'left'}}>Title</label>&nbsp;
                <input  name="title"
                        type="text" 
                        placeholder='제목을 입력하세요' 
                        value={title}
                        onChange={onChange}
                        style={{display:'flex', alignItems: 'center', 
                                padding: '3px', margin:'5px 0 5px 0'}}
                        size={100}/>
            </div>
            <div>
                <label htmlFor='content'  style={{textAlign: 'left'}}>Content</label>&nbsp;
                <textarea  name="content"
                        type="text" 
                        placeholder='내용을 입력하세요' 
                        value={content}
                        onChange={onChange}
                        style={{display:'flex', alignItems: 'center', 
                                resize: 'none', padding: '3px', 
                                width: '100%', height: '100px',
                                margin:'5px 0 5px 0' }}
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