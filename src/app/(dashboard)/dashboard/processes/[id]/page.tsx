export default async function ProcessInfoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    return <div>{id}</div>;
}
