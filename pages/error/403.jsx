import styles from '@/styles/Home.module.css'
import axios from 'axios';
import { useQuery } from 'react-query';

export default function Custom403() {

    const data = useQuery(['data'], () =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/error/403`),
    {
        useErrorBoundary: true,
        retry: 0
    })

    return(
        <>
            <div className={styles.description}>
                <p> 
                    Error 403
                </p>
                <div>
                    <a href="/">Home</a>
                </div>
            </div>
            <div>
                Hello 403
            </div>
        </>
    )
}
