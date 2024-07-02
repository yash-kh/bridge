import axios from 'axios';
import { API_URLS, baseURL } from '../constants/APIConstants.js';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    // 'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const fetchTokensFromXYFinance = async (chainId) => {
  try {
    const response = await axiosInstance.get(API_URLS.GET_TOKENS + `?chainId=${chainId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchChainsFromXYFinance = async () => {
  try {
    const response = await axiosInstance.get(API_URLS.GET_BLOCKCHAINS);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchQuoteFromXYFinance = async (srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress) => {
  try {
    const response = await axiosInstance.get(API_URLS.GET_QUOTE, { params: { srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress, slippage: 1 } });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error.response.data.detail);
    throw error;
  }
};

export const fetchTransactionParamsFromXYFinance = async (token, chain) => {
  try {
    const response = await axiosInstance.post(API_URLS.POST_PARAMS, { token, chain });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction params:', error);
    throw error;
  }
};
