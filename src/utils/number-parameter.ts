import { NextRequest } from "next/server";

export function numberParameter(request: NextRequest, name: string): number | null {
    const searchParams = request.nextUrl.searchParams;
    const raw = searchParams.get(name);
    return (raw && !Number.isNaN(+raw)) ? +raw : null;
}
