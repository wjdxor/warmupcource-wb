import '@/styles/globals.css'

import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import Layout from '@/components/layout/layout'
import {RecoilRoot} from "recoil";
import LoginAuthCheck from "@/utils/loginAuthCheck";

export default function App({Component, pageProps}) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={true}/>
            <RecoilRoot>
                <Layout>
                    <LoginAuthCheck component={Component} pageProps={pageProps} />
                </Layout>
            </RecoilRoot>
        </QueryClientProvider>
    )
}
