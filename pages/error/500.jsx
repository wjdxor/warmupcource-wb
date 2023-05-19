import styles from '@/styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';


export default function Custom500() {
    
    // 변수명을 이용한 useErrorBoundary 연습
    const [errBoundary, setErrBoundary] = useState(false);
    const [URL, setURL] = useState(`${process.env.NEXT_PUBLIC_API_URL}/error/500`)
	const getErr = async (url) => {
		return await axios.get(url)
	}

    const data = useMutation((data) => getErr(URL), {
		onError: (error) => {
            console.log("에러: "+error.response.status);
            if(error.response.status === 500){
                setErrBoundary(true);
            }else{
                alert("500이 아닌에러!!");
            }
		},
		useErrorBoundary: errBoundary,
	})
        
    const onClick = (e) => {
        e.preventDefault();
        data.mutate();
    }

    return(
        <>
            <div className={styles.description}>
                <p> 
                    Error 500
                </p>
                <div>
                    <a href="/">Home</a>
                </div>
            </div>
            <div>
                <button onClick={onClick}>500에러 발생</button>
            </div>
        </>
    )
}
