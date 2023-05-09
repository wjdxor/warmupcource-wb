import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';
import { useState } from "react";
import { useForm } from 'react-hook-form';

//회원가입
export default function Join (){
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} = useForm();
    const onSubmit = (data) => {
        console.log(data);
    }

    return(
        <>  
            <div className={styles.description}>
            <p onClick={() => router.back()}> 
                뒤로가기 
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor='id' style={{margin: '5px'}}>ID : </label>&nbsp;
                    <input type="text" name="joinId" id="id"  
                        {...register("joinId",
                            {required: true,
                             pattern: /^[a-zA-Z]+$/})} 
                        placeholder="아이디를 입력하세요" 
                        style={{padding: '3px', marginBottom:'10px', textAlign:'center'}} />
                    {errors.joinId?.type === "required" && <p>아이디를 입력해 주세요.</p>}
                    {errors.joinId?.type === "pettern" && <p>아이디는 영문자 1~10자리로 입력해주세요.</p>}
                    <br/>
                    <label htmlFor='pw' >PW : </label>&nbsp;
                    <input type="text" name="joinPw" id="pw" 
                        {...register("joinPw",
                            {required: true,
                             pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/})} 
                        placeholder="비밀번호를 입력하세요"
                        style={{padding: '3px', marginBottom:'10px', textAlign:'center'}} />
                    {errors.joinPw?.type === "required" && <p>비밀번호를 입력해 주세요.</p>}
                    {errors.joinPw?.type  === "pettern" && <p>비밀번호는 최소 8 자, 대문자 하나 이상, 소문자 하나 및 숫자 하나가 필요합니다.</p>}
                    <br/>
                    <label htmlFor='pwConfirm' >PW Confirm : </label>&nbsp;
                    <input type="text" name="joinPw"  id="pwConfirm"
                        {...register("joinPw",
                            {...register("pwComfirm")})} 
                        placeholder="비밀번호를 재입력하세요" 
                        style={{padding: '3px', marginBottom:'10px', textAlign:'center'}} />
                    <button type='submit'
                        style={{textAlign:'center', padding: '3px', margin:'auto',display:'block', width: '100%'}}>
                        가입하기
                    </button>
                </form>
                <br/>

            </div>
        </>
    );
}