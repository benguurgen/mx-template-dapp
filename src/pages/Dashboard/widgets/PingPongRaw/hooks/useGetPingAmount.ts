import { useState, useEffect } from 'react';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { contractAddress } from 'config';
import { PingPongResponseType } from '../types';
import { useGetNetworkConfig } from 'lib/sdkDappCore';

const decodeAmount = (data: PingPongResponseType) => {
  const returnValue = data.data.data.returnData[0];
  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');

  return new BigNumber(decodedString, 16).toString(10);
};

export const useGetPingAmount = () => {
  const [pingAmount, setPingAmount] = useState<string>('0');
  const { network } = useGetNetworkConfig();

  const getPingAmount = async () => {
    try {
      const { data } = await axios.post<PingPongResponseType>(
        `${network.apiAddress}/vm-values/query`,
        {
          scAddress: contractAddress,
          funcName: 'getPingAmount',
          args: []
        }
      );

      const amount = decodeAmount(data);
      setPingAmount(amount);
    } catch (err) {
      console.error('Unable to call getPingAmount - RAW', err);
    }
  };

  useEffect(() => {
    console.log('\x1b[42m%s\x1b[0m', 'useGetPingAmount in effect');

    getPingAmount();
  }, []);

  return pingAmount;
};
