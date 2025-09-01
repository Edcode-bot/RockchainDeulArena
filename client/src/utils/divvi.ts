
import { getReferralTag, submitReferral } from '@divvi/referral-sdk';
import { createWalletClient, custom, parseEther, encodeFunctionData, concat, toHex } from 'viem';
import { celo } from 'viem/chains';

// Contract ABI for basic functions
const GAME_CONTRACT_ABI = [
  {
    name: 'placeBet',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'gameType', type: 'uint8' },
      { name: 'prediction', type: 'uint8' }
    ],
    outputs: []
  },
  {
    name: 'mintWinnerNFT',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' }
    ],
    outputs: []
  }
] as const;

export const GAME_CONTRACT_ADDRESS = '0x13b235E666caB3b2151557F226dB2ceF5163923c';
export const DIVVI_CONSUMER_ADDRESS = '0xe38a456433FfF7814e40998cf0Cbbbd2c885B513';

export async function placeBetTransaction(
  account: string, 
  gameType: number, 
  prediction: number, 
  betAmount: string = '0.01'
) {
  try {
    const walletClient = createWalletClient({
      chain: celo,
      transport: custom(window.ethereum),
    });

    // Encode the function call
    const functionData = encodeFunctionData({
      abi: GAME_CONTRACT_ABI,
      functionName: 'placeBet',
      args: [gameType, prediction]
    });

    // Get referral tag
    const referralTag = getReferralTag({
      user: account,
      consumer: DIVVI_CONSUMER_ADDRESS,
    });

    // Properly concatenate function data with referral tag using viem's concat
    const finalData = concat([
      functionData as `0x${string}`,
      referralTag as `0x${string}`
    ]);

    console.log('Function data:', functionData);
    console.log('Referral tag:', referralTag);
    console.log('Final data:', finalData);

    const txData = {
      to: GAME_CONTRACT_ADDRESS as `0x${string}`,
      data: finalData,
      value: parseEther(betAmount),
      account: account as `0x${string}`
    };

    const txHash = await walletClient.sendTransaction(txData);
    
    // Submit referral tracking
    const chainId = await walletClient.getChainId();
    await submitReferral({ txHash, chainId });

    return txHash;
  } catch (error) {
    console.error('Bet transaction failed:', error);
    throw error;
  }
}

export async function mintNFTTransaction(account: string) {
  try {
    const walletClient = createWalletClient({
      chain: celo,
      transport: custom(window.ethereum),
    });

    // Encode the function call
    const functionData = encodeFunctionData({
      abi: GAME_CONTRACT_ABI,
      functionName: 'mintWinnerNFT',
      args: [account as `0x${string}`]
    });

    // Get referral tag
    const referralTag = getReferralTag({
      user: account,
      consumer: DIVVI_CONSUMER_ADDRESS,
    });

    // Properly concatenate function data with referral tag using viem's concat
    const finalData = concat([
      functionData as `0x${string}`,
      referralTag as `0x${string}`
    ]);

    console.log('NFT Function data:', functionData);
    console.log('NFT Referral tag:', referralTag);
    console.log('NFT Final data:', finalData);

    const txData = {
      to: GAME_CONTRACT_ADDRESS as `0x${string}`,
      data: finalData,
      value: 0n,
      account: account as `0x${string}`
    };

    const txHash = await walletClient.sendTransaction(txData);
    
    // Submit referral tracking
    const chainId = await walletClient.getChainId();
    await submitReferral({ txHash, chainId });

    return txHash;
  } catch (error) {
    console.error('NFT mint transaction failed:', error);
    throw error;
  }
}
