import styles from '@/styles/Home.module.css'
import { Margarine } from 'next/font/google';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { postByIdSelector } from '@/recoil/boardPost';

export default function View (){
    const router = useRouter();
    const { query } = useRouter();
    const id = query.id;

    const post = useRecoilValue(postByIdSelector(Number(id)));
    
    //수정하기
    const onEdit = () => {
        router.push({
            pathname: "/board/edit",
            query: {post: JSON.stringify(post)}
          })
    }

    //삭제하기
    const delPost = useMutation((post) => {
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_POST_POST+'/'+post.id}`)}
        , {
        onSuccess: () => {
            router.push('/board/posts');
        },
        onError: () => {
            alert("실패");
        }
     })

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