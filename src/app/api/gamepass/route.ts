import { NextRequest, NextResponse } from "next/server";

async function getPlayerGames(userId: string): Promise<{ id: string }[]> {
  const res = await fetch(`https://games.roblox.com/v2/users/${userId}/games`)
  const data = await res.json()
  return data.data
}

async function getGamePasses(universeId: string): Promise<{ id: number, name: string, price: number | null }[]> {
  const res = await fetch(`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`)
  const data = await res.json()
  return data.data
}

async function getIdFromUsername(username: string): Promise<{ id: number }> {
  const res = await fetch(`https://users.roblox.com/v1/usernames/users`, {
    method: "POST",
    body: JSON.stringify({
      usernames: [username],
      excludeBannedUsers: true
    })
  })
  const data = await res.json()
  return data.data[0]
}


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

  const sellableOnly = !!searchParams.get("sellableOnly")

  const games = await getPlayerGames(id)
  const allGamepasses = await Promise.all(games.map(game => getGamePasses(game.id))).then(passes => passes.flat())

  return NextResponse.json(allGamepasses.filter(gamepass => {
    if (!sellableOnly) return true
    return typeof gamepass.price === "number"
  }))
}
