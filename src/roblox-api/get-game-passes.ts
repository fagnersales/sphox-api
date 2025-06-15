export async function getGamePasses(universeId: string): Promise<{ id: number, name: string, price: number | null }[]> {
    const res = await fetch(`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`)
    const data = await res.json()
    return data.data
}
