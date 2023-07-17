import styles from '@/styles/Home.module.css'

import {useQuery} from "react-query";
import {useRouter} from 'next/router';
import axios from 'axios'
import Link from 'next/link';
import {useState} from 'react';
import Pagination from '@/components/Pagination';
import {useRecoilState, useRecoilValue} from "recoil";
import {accessTokenState, isLoggedIn, refreshTokenState, accessTokenExpireState, refreshTokenExpireState} from "@/recoil/auth";
import {boardPosts} from '@/recoil/boardPost';

export default function Posts() {

    const router = useRouter();
    const {id} = router.query;
    const [perPage, setPerPage] = useState(5); // 페이지 당 게시물 수
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const offset = (page - 1) * perPage; // 첫 게시물의 위치
    const [search, setSearch] = useState('');

    const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
    const [isLogIn, setIsLogIn] = useRecoilState(isLoggedIn)
    const refreshToken = useRecoilValue(refreshTokenState)
    const accessTokenExpire = useRecoilValue(accessTokenExpireState)
    const refreshTokenExpire = useRecoilValue(refreshTokenExpireState)
    const [posts, setPosts] = useRecoilState(boardPosts);


    // const {data} = useQuery(["posts"], () => {
    const {isLoading, isError, data, error, refetch} = useQuery(["posts"], async () => {
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_GET_POSTS}`
                , {headers: {Authorization: `Bearer ${accessToken}`}}
            ).then(res => setPosts(res.data))
        },
        {
            retry: false
        }
    );

    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

// console.log(data)

    return (
        <>
            <div className={styles.description}>
                <p>
                    <code className={styles.code}>Posts</code>
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
                <table style={{textAlign: 'center'}}>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th style={{padding: '20px'}}>TITLE</th>
                        <th style={{paddingRight: '20px'}}>WRITER</th>
                        <th>DATE</th>
                    </tr>
                    </thead>
                    {
                        posts?.slice(offset, offset + perPage)?.map(post => (
                            <tbody key={post.id}>
                            <tr>
                                <td>{post.id}</td>
                                <td style={{textDecoration: 'underline', padding: '0 20px 0 20px'}}>
                                    <Link href={{pathname: './view', query: {id: post.id}}}
                                          as={`./view?${post.id}`}>
                                        {post.title}
                                    </Link>
                                </td>
                                <td style={{paddingRight: '20px'}}>{post.writer ? post.writer : "알수없는 사용자"}</td>
                                <td>{post.createdAt.substr(0, 10)}</td>
                            </tr>
                            </tbody>
                        ))
                    }
                </table>
                {posts && <Pagination total={posts.length} perPage={perPage} page={page} setPage={setPage}/>}
            </div>
        </>
    )
}
