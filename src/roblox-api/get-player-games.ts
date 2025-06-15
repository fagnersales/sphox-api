export async function getPlayerGames(userId: string): Promise<{ id: string }[]> {
    const res = await fetch(`https://games.roblox.com/v2/users/${userId}/games`)
    const data = await res.json()
    return data.data
}

