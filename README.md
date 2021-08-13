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

