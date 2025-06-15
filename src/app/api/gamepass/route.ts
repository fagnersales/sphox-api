import { NextRequest, NextResponse } from "next/server";
import {
  getIdFromUsername,
  getGamePasses,
  getPlayerInfo,
  getPlayerGames,
  getPlayerAvatar,
} from "@/roblox-api"
import { booleanParameter } from "@/utils/boolean-parameter";
import { numberParameter } from "@/utils/number-parameter";

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

  const sellableOnly = booleanParameter(request, "sellableOnly");
  const withPlayerAvatar = booleanParameter(request, "withPlayerAvatar");

  const amount = numberParameter(request, "amount");
  const errorMargin = numberParameter(request, "errorMargin");
  const limit = numberParameter(request, "limit");

  const games = await getPlayerGames(id)
  const allGamepasses = await Promise.all(games.map(game => getGamePasses(game.id))).then(passes => passes.flat().map(gamepass => {
    return {
      ...gamepass,
      url: `https://www.roblox.com/game-pass/${gamepass.id}`
    }
  }).filter(gamepass => {
    if (amount) {
      if (!gamepass.price) return false;
      if (!errorMargin) return gamepass.price === amount
      const difference = gamepass.price - amount
      if (difference > 0) return false;
      return Math.abs(difference) <= errorMargin
    }

    if (!sellableOnly) return true
    return typeof gamepass.price === "number"
  }).sort((a, b) => {
    if (!a.price) return 0
    if (!b.price) return 0
    return a.price - b.price
  }).slice(0, limit ?? 100))

  const player = await getPlayerInfo(id)

  const response: any = {
    player,
    gamepasses: allGamepasses,
  }

  if (withPlayerAvatar) {
    response.avatar = await getPlayerAvatar(id)
  }

  return NextResponse.json(response)
}
