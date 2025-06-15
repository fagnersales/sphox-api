export async function getPlayerAvatar(userId: string | number, retries: number = 0): Promise<{ imageUrl: string }> {
    const res = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=100x100&format=webp&isCircular=true`)
    const data = await res.json()
    const result = data.data[0]
    if (result.state !== "Completed" && retries === 0) return getPlayerAvatar(userId, 1)
    return result
}

