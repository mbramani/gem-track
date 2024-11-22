export default async function ClientInfoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    return <div>{id}</div>;
}
