# NetSepio Chromium Extension
Browser Extension allowing users to vote for a website categorizing it into various categories and get rewards. This enables users to preemptively protect their online activities from advanced threats like malware, spyware, adware etc. in a collaborative way using a Blockchain based Smart Contract.

## Vision
NetSepio aims to provide a safe and secure internet browsing experience through Data Democratization to empower individuals & companies to use the data in their decision making.

## Mission
Our Mission is to create a tools like Browser Extensions and Mobile Apps to give users insights on the safe and harmful websites/domains they browse and allow them to categorize them into different categories as Safe, Spyware, Malware, Phishing etc. This enables them to safeguard against emerging advanced threats in a collaborative way with a decentralized and tamper-proof process using blockchain technology.

## What's next for NetSepio
1. Reward Tokenomics.
2. Mechanisms to control spam voting.

## Ceramic Integration

# Schema

``` ceramic create tile --content 
'{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "NetSepio Review",
    "properties": {
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "domainName": {
            "type": "string"
        },
        "websiteURL": {
            "type": "string"
        },
        "websiteType": {
            "type": "string"
        },
        "websiteTag": {
            "type": "string"
        },
        "websiteSafety": {
            "type": "string"
        },
        "attachments": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "domainName",
        "websiteURL",
        "websiteType",
        "websiteTag",
        "websiteSafety"
    ]
}'
```

``` Schema ID: kjzl6cwe1jw1474cgcira1dszy7603ft4i4gwpgdii1csxpw5nna4onx3tffbm8```

``` Commit: k1dpgaqe3i64kjpozl8oajejq83dlslcfhwmqs7526g64kjidvu136aplq2sqdx2wpglzxq1b5dg87bnnxmw3nzlbhdfup0z2rn3fl0yv02g2k8g7ry38g9da```

# Review Creation

``` ceramic create tile --schema k1dpgaqe3i64kjpozl8oajejq83dlslcfhwmqs7526g64kjidvu136aplq2sqdx2wpglzxq1b5dg87bnnxmw3nzlbhdfup0z2rn3fl0yv02g2k8g7ry38g9da --content 
'{
        "title": "Good Website",
        "description": "Software Collaboration, Developers Paradise",
        "domainName": "github.com",
        "websiteURL": "https://github.com/ceramicnetwork/js-ceramic/",
        "websiteType": "website",
        "websiteTag": "genuine",
        "websiteSafety": "safe"
}'

``` Stream ID: kjzl6cwe1jw1470ue9ikdja9jcvaqk1n1gi250kb61c30h2pgq8803rbxjtiu9f```

ceramic-api - https://github.com/NetSepio/ceramic-api

API Server for Creating and Viewing Streams (to be run along with ceramic daemon)

## SmartContract

Smart Contract for the NetSepio Voting and NFT Minting Operations
https://github.com/NetSepio/SmartContract

Polygon Mumbai Testnet:

https://mumbai.polygonscan.com/address/0x8869088f4B2B415b8D0C5f3882BE03a214EFF4B0#code

Deployed Contract address: 0x8869088f4B2B415b8D0C5f3882BE03a214EFF4B0

Default Moderator: 0x2dA0a615981C2c9c70E34b8f50Db5f5a905E7928 


## The Graph

Build completed: QmZ5R3gSFC8MjkGZ2krBq8w3QZzzR76fbzLvbUwhN2wg3J

Deployed to https://thegraph.com/studio/subgraph/net

Subgraph Endpoints:

Queries (HTTP):     https://api.studio.thegraph.com/query/5758/net/v0.0.1
Subscriptions (WS): https://api.studio.thegraph.com/query/5758/net/v0.0.1

## WebScrape Bot 

Github - https://github.com/NetSepio/webscrape 

Scrape Websites based on the reviews submitted and add it's content on IPFS.
