import { getReferralTag, submitReferral } from '@divvi/referral-sdk'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

export const sendDivviTransaction = async ({
  account,
  to,
  data,
  value,
}: {
  account: `0x${string}`
  to: `0x${string}`
  data: string
  value: bigint
}) => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum as any),
  })

  const referralTag = getReferralTag({
    user: account,
    consumer: '0xe38a456433FfF7814e40998cf0Cbbbd2c885B513' as `0x${string}`, // RockChain Duel Arena identifier
  })

  const txHash = await walletClient.sendTransaction({
    account,
    to,
    data: (data + referralTag) as `0x${string}`,
    value,
  })

  const chainId = await walletClient.getChainId()

  await submitReferral({
    txHash,
    chainId,
  })

  return txHash
}