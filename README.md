# Roblox Gamepass API Documentation

## Overview

This API allows you to retrieve gamepass information for any Roblox player, including their profile details and avatar. The API fetches all gamepasses from the player's games and provides filtering and sorting options.

## Base URL

```
https://sphox-api.vercel.app/api/gamepass
```

## Endpoint

### GET `/api/gamepass`

Retrieves gamepass information for a specified Roblox player.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No* | The Roblox user ID |
| `username` | string | No* | The Roblox username |
| `sellableOnly` | boolean | No | Filter to show only gamepasses with prices (default: false) |
| `withPlayerAvatar` | boolean | No | Include player avatar in response (default: false) |
| `amount` | number | No | Filter gamepasses by exact price or within error margin |
| `errorMargin` | number | No | Acceptable price difference when using `amount` parameter |
| `limit` | number | No | Maximum number of gamepasses to return (default: 100) |

*Either `userId` or `username` must be provided.

## Request Examples

### Basic request with username
```
GET /api/gamepass?username=thefirstneable
```

### Request with avatar and sellable filter
```
GET /api/gamepass?username=thefirstneable&withPlayerAvatar=true&sellableOnly=true
```

### Request with price filtering
```
GET /api/gamepass?userId=1047686711&amount=100&errorMargin=50&limit=10
```

## Response Format

### Success Response (200)

```json
{
  "gamepasses": [
    {
      "id": 769416964,
      "name": "tergterre",
      "displayName": "tergterre",
      "productId": 1793785110,
      "price": 24,
      "sellerName": "TheFirstNeable",
      "sellerId": 1047686711,
      "isOwned": false,
      "url": "https://www.roblox.com/game-pass/769416964"
    }
  ],
  "player": {
    "description": "Work.\n\n\n\n\n\nepic shop cyan hood flower hood blue",
    "created": "2019-04-20T03:59:05.297Z",
    "isBanned": false,
    "externalAppDisplayName": null,
    "hasVerifiedBadge": false,
    "id": 1047686711,
    "name": "TheFirstNeable",
    "displayName": "akari_doggg"
  },
  "avatar": {
    "targetId": 1047686711,
    "state": "Completed",
    "imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-FF8EC9DD0B70C1AD43A1B90AE1CB973F-Png/100/100/AvatarHeadshot/Webp/isCircular",
    "version": "TN3"
  }
}
```

### Response Fields

#### Gamepass Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique gamepass ID |
| `name` | string | Gamepass name |
| `displayName` | string | Display name of the gamepass |
| `productId` | number | Roblox product ID |
| `price` | number/null | Price in Robux (null if not for sale) |
| `sellerName` | string | Username of the seller |
| `sellerId` | number | User ID of the seller |
| `isOwned` | boolean | Whether the gamepass is owned |
| `url` | string | Direct link to the gamepass page |

#### Player Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Player's user ID |
| `name` | string | Player's username |
| `displayName` | string | Player's display name |
| `description` | string | Player's profile description |
| `created` | string | Account creation date (ISO format) |
| `isBanned` | boolean | Whether the player is banned |
| `hasVerifiedBadge` | boolean | Whether the player has a verified badge |
| `externalAppDisplayName` | string/null | External app display name |

#### Avatar Object (only when `withPlayerAvatar=true`)
| Field | Type | Description |
|-------|------|-------------|
| `targetId` | number | Player's user ID |
| `state` | string | Avatar generation state |
| `imageUrl` | string | Direct URL to avatar image |
| `version` | string | Avatar version identifier |

## Error Responses

### 400 Bad Request
```json
{
  "error": "at least the userId or the username must exist in the search params"
}
```

### 404 Not Found
```json
{
  "error": "UserId not found from the username"
}
```

```json
{
  "error": "UserId not found"
}
```

## Filtering and Sorting

### Price Filtering
- Use `amount` parameter to filter by price
- Use `errorMargin` with `amount` to allow price tolerance
- Example: `amount=100&errorMargin=25` returns gamepasses priced between 75-100 Robux

### Sellable Only Filter
- Set `sellableOnly=true` to exclude free gamepasses
- Only shows gamepasses with numeric prices

### Sorting
- Gamepasses are automatically sorted by price (ascending)
- Free gamepasses (price: null) appear at the beginning

### Limiting Results
- Use `limit` parameter to control response size
- Default limit is 100 gamepasses
- Useful for pagination or reducing response size

## Rate Limiting

This API relies on Roblox's public endpoints. Be mindful of rate limits and implement appropriate delays between requests to avoid being temporarily blocked.

## Notes

- The API fetches gamepasses from all games created by the specified player
- Avatar images are generated as 100x100 WebP format, circular cropped
- Free gamepasses have `price: null`
- The API automatically retries avatar generation if initial request fails
