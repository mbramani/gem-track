export default async function EmployeeInfoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    return <div>{id}</div>;
}
