export async function getPlayerInfo(userId: string | number): Promise<any> {
    const res = await fetch(`https://users.roblox.com/v1/users/${userId}`)
    const data = await res.json()
    return data
}

