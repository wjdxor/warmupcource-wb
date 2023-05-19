import '@/styles/globals.css'

import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import Layout from '@/components/layout/layout'
import {RecoilRoot} from "recoil";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/errorFallback';

export default function App({Component, pageProps}) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={true}/>
            <RecoilRoot>
                <ErrorBoundary 
                    FallbackComponent={ErrorFallback}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ErrorBoundary>
            </RecoilRoot>
        </QueryClientProvider>
    ) 
}
