const localBaseURL = "http://localhost:5000/api";
const productionBaseURL = "https://api.xy.fi/api";
export const baseURL =
  process.env.NODE_ENV === "production" ? productionBaseURL : localBaseURL;

export const API_URLS = {
  GET_TOKENS: "tokens",
  GET_BLOCKCHAINS: "tokens/blockchains",
  POST_QUOTE: "quotes",
  POST_PARAMS: "params",
};
