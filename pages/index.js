import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
        <div className={styles.description}>
          <p>
            Let's Warm up!!&nbsp;
            <code className={styles.code}>Next.JS</code>
          </p>
          <div>
            {/* <a
              href="http://mydata.re.kr"
            > */}
            <a href="/user/login">
              {/* By MyDATA */}
              Login
            </a>
          </div>
        </div>
    </>
  )
}