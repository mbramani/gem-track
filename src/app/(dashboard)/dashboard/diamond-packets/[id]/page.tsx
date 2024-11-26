export default async function DiamondPacketInfoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    return <div>{id}</div>;
}
