import { trpc } from '@/trpc/server';

export default async function Home() {
    void trpc.hello.prefetch({ text: 'hellow' });
    return (
        <>
            <h1>Home</h1>
        </>
    );
}
