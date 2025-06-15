export async function getIdFromUsername(username: string): Promise<{ id: number }> {
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
