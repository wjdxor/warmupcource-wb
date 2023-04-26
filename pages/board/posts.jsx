import styles from '@/styles/Home.module.css'

import { useQuery } from "react-query";
import axios from 'axios'

export default function Posts() {

  const { isLoading, isError, data, error, refetch } = useQuery(["posts"], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_GET_POSTS}`)
      .then((res) => res.data)
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log(data)
 
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
          {
            data?.map(post => (
              <div>{post.title}</div>
            ))
          }
        </div>
    </>
  )
}
