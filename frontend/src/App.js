import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { IoSwapVertical } from "react-icons/io5";
import TokenList from "./components/TokenList";
import axiosInstance from "./utils/axiosInstance";
import { handelXYError } from "./utils/XYApi";
import { API_URLS } from "./constants/APIConstants";

const App = () => {
  const [fromToken, setFromToken] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [toToken, setToToken] = useState("");
  const [toChain, setToChain] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startedFetching, setStartedFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usPrice, setUsPrice] = useState({ to: "", from: "" });
  const [isServerLive, setIsServerLive] = useState(false);

  const valueMultiplier = 10 ** 18;

  const formatValue = (value) =>
    (parseInt(value) * valueMultiplier).toLocaleString("fullwide", {
      useGrouping: false,
    });

  const handleQuoteFetch = async (
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress
  ) => {
    const data = {
      srcChainId,
      srcQuoteTokenAddress,
      srcQuoteTokenAmount,
      dstChainId,
      dstQuoteTokenAddress,
    };

    try {
      setErrorMsg("");
      setIsLoading(true);
      const response = await axiosInstance.post(API_URLS.POST_QUOTE, data);
      handelXYError(response);

      const route = response?.data?.routes[0];
      setToValue(route?.dstQuoteTokenAmount / valueMultiplier);
      setUsPrice({
        to: route?.dstQuoteTokenUsdValue,
        from: route?.srcQuoteTokenUsdValue,
      });
    } catch (error) {
      setErrorMsg(error.message);
      setToValue("");
      setUsPrice({ to: "", from: "" });
    } finally {
      setIsLoading(false);
      setStartedFetching(true);
    }
  };

  const handleFromValueChange = (value) => {
    if (!value) return;

    setFromValue(value);
    if (fromToken && toToken) {
      handleQuoteFetch(
        fromChain.chainId,
        fromToken.address,
        formatValue(value),
        toChain.chainId,
        toToken.address
      );
    }
  };

  const handleTokenChange = (
    setToken,
    token,
    otherToken,
    value,
    srcChain,
    dstChain
  ) => {
    if (!token) return;
    setToken(token);
    if (!otherToken || !value) return;

    handleQuoteFetch(
      srcChain.chainId,
      token.address,
      formatValue(value),
      dstChain.chainId,
      otherToken.address
    );
  };

  const handleRefresh = () => {
    handleQuoteFetch(
      fromChain.chainId,
      fromToken.address,
      formatValue(fromValue),
      toChain.chainId,
      toToken.address
    );
  };

  const handleSwap = () => {
    let tempFromToken = fromToken;
    let tempFromChain = fromChain;
    let tempToToken = toToken;
    let tempToChain = toChain;
    setFromChain(tempToChain);
    setFromToken(tempToToken);
    setToChain(tempFromChain);
    setToToken(tempFromToken);

    handleQuoteFetch(
      tempToChain.chainId,
      tempToToken.address,
      formatValue(fromValue),
      tempFromChain.chainId,
      tempFromToken.address
    );
  };

  const checkHotReload = async () => {
    try {
      const response = await axiosInstance.get();
      setIsServerLive(true);
      console.log("Server is running:", response.data);
    } catch (error) {
      console.error("Server check failed:", error.message);
    }
  };

  useEffect(() => {
    checkHotReload();
  }, []);

  return (
    <div className="App min-h-screen bg-gray-800 flex items-center justify-center">
      {!isServerLive ? (
        <p className="text-red-500">Server is now hot reloading</p>
      ) : (
        <div className="w-full max-w-md p-8 bg-gray-900 text-white rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Bridge</h1>
            <button
              onClick={handleRefresh}
              className="text-white hover:text-gray-300"
            >
              <FiRefreshCw size={24} />
            </button>
          </div>
          <TokenList
            title="From"
            token={fromToken}
            updateToken={(token) =>
              handleTokenChange(
                setFromToken,
                token,
                toToken,
                fromValue,
                fromChain,
                toChain
              )
            }
            chain={fromChain}
            updateChain={setFromChain}
            setInputValue={handleFromValueChange}
            usdValue={usPrice.from}
          />
          <div className="text-center">
            <button
              onClick={handleSwap}
              className="text-white hover:text-gray-300"
            >
              <IoSwapVertical size={24} />
            </button>
          </div>
          <TokenList
            title="To"
            token={toToken}
            disableInput={true}
            updateToken={(token) =>
              handleTokenChange(
                setToToken,
                token,
                fromToken,
                fromValue,
                toChain,
                fromChain
              )
            }
            chain={toChain}
            updateChain={setToChain}
            toValue={toValue}
            usdValue={usPrice.to}
          />
          {isLoading ? (
            <div className="mt-4 animate-pulse">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : errorMsg ? (
            <div className="text-red-500 text-center mt-4 text-sm font-bold">
              Error: {errorMsg}
            </div>
          ) : (
            <div className="text-green-500 text-center mt-4 text-sm font-bold">
              {startedFetching ? "Quote Fetched" : "Enter values to get quote"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
