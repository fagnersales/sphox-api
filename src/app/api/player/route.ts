import { NextRequest, NextResponse } from "next/server";
import {
    getIdFromUsername,
    getPlayerInfo,
    getPlayerAvatar,
} from "@/roblox-api"
import { booleanParameter } from "@/utils/boolean-parameter";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    const username = searchParams.get("username")
    if (!userId && !username) return NextResponse.json({ error: "at least the userId or the username must exist in the search params" }, { status: 400 })

    let id = userId;

    if (username) {
        const result = await getIdFromUsername(username)
        if (!result) return NextResponse.json({ error: "UserId not found from the username" }, { status: 404 })
        id = result.id.toString()
    }

    if (!id) {
        return NextResponse.json({ error: "UserId not found" }, { status: 404 })
    }

    const withPlayerAvatar = booleanParameter(request, "withPlayerAvatar");

    const player = await getPlayerInfo(id)

    const response: any = {
        player,
    }

    if (withPlayerAvatar) {
        response.avatar = await getPlayerAvatar(id)
    }

    return NextResponse.json(response)
}
