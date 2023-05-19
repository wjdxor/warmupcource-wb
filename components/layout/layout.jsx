import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>MyDATA Warmup</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {children}
        <div className={styles.grid}>
          <a
            href="/board/posts"
            className={styles.card}
          >
            <h2>
              List of Posts <span>-&gt;</span>
            </h2>
            <p>
              Let's go check the list of posts.
            </p>
          </a>
          <a
            href="/board/write"
            className={styles.card}
          >
            <h2>
              Write a Post <span>-&gt;</span>
            </h2>
            <p>
              Let's go write a post.
            </p>
          </a>

          <a
            href="/"
            className={styles.card}
          >
            <h2>
              Preparing <span>-&gt;</span>
            </h2>
            <p>
              ...
            </p>
          </a>

          <a
            href="/"
            className={styles.card}
          >
            <h2>
              Preparing <span>-&gt;</span>
            </h2>
            <p>
              ...
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
