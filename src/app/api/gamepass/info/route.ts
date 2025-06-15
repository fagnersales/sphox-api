import { getGamepassInfo, getPlayerAvatar, getPlayerInfo } from "@/roblox-api";
import { booleanParameter } from "@/utils/boolean-parameter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gamepassId = searchParams.get("gamepassId")

  if (!gamepassId) {
    return NextResponse.json({ error: "gamepassId is required in search params" }, { status: 400 })
  }

  // Validate that gamepassId is a number
  if (Number.isNaN(+gamepassId)) {
    return NextResponse.json({ error: "gamepassId must be a valid number" }, { status: 400 })
  }

  const withPlayerAvatar = booleanParameter(request, "withPlayerAvatar");

  try {
    const gamepassData = await getGamepassInfo(gamepassId)

    const response: any = {
      gamepass: {
        name: gamepassData.Name,
        creator: {
          id: gamepassData.Creator.Id,
          name: gamepassData.Creator.Name,
        },
        price: gamepassData.PriceInRobux,
        updated: gamepassData.Updated,
        created: gamepassData.Created,
        url: `https://www.roblox.com/game-pass/${gamepassId}`
      }
    }

    response.player = await getPlayerInfo(gamepassData.Creator.Id)

    if (withPlayerAvatar) {
      response.avatar = await getPlayerAvatar(gamepassData.Creator.Id)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching gamepass info:', error)

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json({ error: "Gamepass not found" }, { status: 404 })
      }
      if (error.message.includes('403')) {
        return NextResponse.json({ error: "Access denied to gamepass information" }, { status: 403 })
      }
    }

    return NextResponse.json({ error: "Failed to fetch gamepass information" }, { status: 500 })
  }
}
