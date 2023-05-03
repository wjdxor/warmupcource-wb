import styles from '@/styles/Home.module.css'

import { useQuery } from "react-query";
import { useRouter } from 'next/router';
import axios from 'axios'
import Link from 'next/link';
import { useState } from 'react';
import Pagination from '@/components/Pagination';

export default function Posts() {
  
  const router = useRouter();
  const {id} = router.query;
  const [perPage, setPerPage] = useState(5); // 페이지 당 게시물 수
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const offset = (page - 1) * perPage; // 첫 게시물의 위치
  const [search, setSearch] = useState();
  const [items, setItems] = useState([]);

  const { isLoading, isError, data, error, refetch } = useQuery(["posts"], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_GET_POSTS}`)
      .then((res) => res.data)
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log(data)

  //검색
  const onChange = (e) => {
    setSearch(e.target.value);
    console.log(search);
  }



  return (
    <>
        <div className={styles.description}>
          <p>
            <code className={styles.code}>Posts</code>
          </p>
          <div>
            <input type='text' placeholder='Search'
                   value={search} onChange={onChange}
                   name="search" style={{padding:'3px'}}/>
          </div>
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
              <th style={{padding: '20px'}}>No.</th>
              <th>TITLE</th>
              <th>WRITER</th>
            </tr>
            </thead>
            {
              data.slice(offset, offset + perPage)?.map(post => (           
              <tbody key={post.id}>
                <tr>
                  <td>{post.id}</td>
                  <td style={{textDecoration:'underline', padding: '0 20px 0 20px'}}>
                    <Link href={{
                                  pathname: './view',
                                  query: {post: JSON.stringify(post)}
                              }}
                              as={`./view?${post.id}`}>
                        {post.title}
                      </Link>
                    </td>
                  <td>{post.writer? post.writer: "알수없는 사용자"}</td>
                </tr> 
              </tbody>
              ))
            }
          </table>
          <Pagination total={data.length} perPage={perPage}
                      page={page} setPage={setPage} />
        </div>
    </>
  )
}
