export interface GamepassInfo {
    TargetId: number,
    ProductType: 'Game Pass',
    AssetId: 0,
    ProductId: number,
    Name: string,
    Description: string,
    AssetTypeId: 0,
    Creator: {
        Id: number,
        Name: string,
        CreatorType: 'User',
        CreatorTargetId: number
    },
    IconImageAssetId: number,
    Created: string,
    Updated: string,
    PriceInRobux: number | null,
    PriceInTickets: number | null,
    Sales: number,
    IsNew: boolean,
    IsForSale: boolean,
    IsPublicDomain: boolean,
    IsLimited: boolean,
    IsLimitedUnique: boolean,
}

export async function getGamepassInfo(gamepassId: string): Promise<GamepassInfo> {
    const res = await fetch(`https://apis.roblox.com/game-passes/v1/game-passes/${gamepassId}/product-info`)
    if (!res.ok) {
        throw new Error(`Failed to fetch gamepass info: ${res.status}`)
    }
    const data = await res.json()
    return data
}

