import { useState } from "react";




export default function ErrorFallback({ error }) {
    
    console.log("에러남 "+error);

    return(
        <>
        <div>에러에러에러에러에러에러에러</div>
        <button onClick={() => location.href="/"}>Home으로 돌아가기</button>
        </>
    )
}