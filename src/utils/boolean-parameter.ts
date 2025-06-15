import { NextRequest } from "next/server";

export function booleanParameter(request: NextRequest, name: string, default_?: boolean): boolean {
    const searchParams = request.nextUrl.searchParams;
    const raw = searchParams.get(name);
    if (raw === null) return default_ || false;
    if (raw === "true") return true;
    if (raw === "false") return false;
    return !!raw || default_ || false;
}
