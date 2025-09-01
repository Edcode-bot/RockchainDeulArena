
import { getReferralTag, submitReferral } from '@divvi/referral-sdk';
import { createWalletClient, custom } from 'viem';
import { celo } from 'viem/chains'; // Use Celo chain

export async function addDivviReferral(txData: any, account: string) {
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum),
  });

  const referralTag = getReferralTag({
    user: account,
    consumer: '0xe38a456433FfF7814e40998cf0Cbbbd2c885B513',
  });

  txData.data += referralTag;

  const txHash = await walletClient.sendTransaction(txData);

  const chainId = await walletClient.getChainId();
  await submitReferral({ txHash, chainId });

  return txHash;
}
