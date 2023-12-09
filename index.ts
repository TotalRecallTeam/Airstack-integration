import { config } from "dotenv";
import { init, fetchQuery } from "@airstack/node";

config();
const airstack_key = process.env.AIRSTACK_API_KEY;
init("1cd1f4c31e4f747c2aabf193868cd7014", "dev");

interface QueryResponse {
  data: Data;
  error: Error;
}

interface Data {
  Wallet: Wallet;
  TokenBalance: TokenBalance;
}

interface Error {
  message: string;
}

interface Wallet {
  socials: Social[];
  addresses: string[];
}

interface TokenBalance {
    owner: Owner;
}

interface Owner {
    addresses: string[];
    domains: Domain[];
    socials: Social[];
    xmtp: xmtp;
}

interface Domain {
    name: string;
    isPrimary: boolean;
}

interface xmtp {
    isXMTPEnabled: boolean;
}

interface Social {
  dappName: "lens" | "farcaster";
  profileName: string;
  userAssociatedAddresses: string[];
}

const GET_VITALIK_LENS_FARCASTER_ENS = `
query MyQuery {
  Wallet(input: {identity: "vitalik.eth", blockchain: ethereum}) {
    socials {
      dappName
      profileName
    }
    addresses
  }
}
`;

const GET_ERC20_TOKEN_HOLDERS = `
query MyQuery {
    TokenBalances(
      input: {filter: {tokenAddress: {_in: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"]}}, blockchain: ethereum, limit: 200}
    ) {
      TokenBalance {
        owner {
          addresses
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            profileName
            userAssociatedAddresses
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }
  `

const USER_BALANCE_OF_SPECIFIC_ERC20 = `
query MyQuery {
    TokenBalances(
      input: {
        filter: {
          tokenAddress: { _eq: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
          owner: { _eq: "0xdef1c0ded9bec7f1a1670819833240f027b25eff" }
        }
        blockchain: ethereum
      }
    ) {
      TokenBalance {
        owner {
          addresses
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            profileName
            userAssociatedAddresses
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }
  `

const main = async () => {
  const { data, error }: QueryResponse = await fetchQuery(USER_BALANCE_OF_SPECIFIC_ERC20);

  if (error) {
    throw new Error(error.message);
  }

  console.log("Data:", data);
};

main();

