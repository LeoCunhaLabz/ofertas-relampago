"use client"

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';

export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const router = useRouter();
  
    const { data, error, isSuccess, isError } = useQuery({
      queryKey:["refresh"],
      queryFn:()=>makeRequest.get("auth/refresh").then((res)=>{
        return res.data
      }),
      retry: false,
      refetchInterval: 60*50*1000,
    });
  
    if (isSuccess) {
      console.log(data.msg);
    }
  
    if(isError){
      console.log(error);
      router.push('/login');
    }

  return (
    <>{children}</>
  )
}