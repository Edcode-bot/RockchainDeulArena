🚀 RockchainDuelArena

RockchainDuelArena is a mobile-first Web3 arcade game where players battle, predict, and earn on-chain rewards. Built on Celo Testnet with MiniPay integration, the game combines fast-paced arcade mechanics with blockchain features and real-time leaderboards.


---

🌟 Features

🎮 Gameplay

2D arcade-style duel arena

Players select characters/rockets and duel against AI or other players

Smooth animations: rocket trails, smoke, particle effects, and parallax backgrounds

Dynamic planet targets and interactive arena

XP system for progression and leaderboard ranking


🏆 Leaderboards

Real-time leaderboard powered by Firebase

Tracks scores, wins, streaks, and rewards

Dynamic updates for all connected players


💳 Web3 Integration

Wallet connection with MiniPay or fallback wallets via Wagmi/viem

Supports Celo Testnet for safe on-chain interactions

On-chain reward logic using smart contracts (Alfajores)

Optional micro-rewards via MiniPay

Smart contracts handle:

Prediction submission

Random landing selection

XP/badge assignment

Event emission (PredictionSubmitted, RoundResult)



🔧 Backend & Persistence

Firebase: real-time database, dynamic leaderboard, player profiles

Cloud functions for score aggregation

On-chain event listening for automatic updates


🎨 Frontend

Next.js + React + TypeScript

TailwindCSS for responsive, mobile-first UI

Framer Motion for smooth animations

Animated arena: rockets, planets, background effects

Accessible dark-mode UI



---

⚡ Dependencies

next & react

tailwindcss

framer-motion

firebase & firebase-admin

wagmi / viem for wallet & blockchain interaction

@celo/contractkit for Celo integration

hardhat + openzeppelin for smart contract development

@celo/celo-composer MCP components for MiniPay + frontend UX

react-icons for planets, rockets, UI elements



---

🛠️ Installation

Clone the repo:

git clone https://github.com/yourusername/rockchainduelarena.git
cd rockchainduelarena

Install dependencies:

npm install

Add environment variables (.env.local):

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_CELO_CHAIN_ID=44787


---

⚡ Run Development

npm run dev

Frontend will be available at http://localhost:3000.
The game is fully functional in the browser, with dynamic Firebase leaderboard updates and placeholder MiniPay flows for testing.


---

🧩 Smart Contract

Located in /contracts/MiniRocketGame.sol

Deploy with Hardhat:


npx hardhat run scripts/deploy.js --network alfajores

Outputs ABI + contract address for frontend integration

Handles prediction submissions, random landing, XP updates, and reward events



---

💳 MiniPay Integration

Uses MiniPay MCP components for wallet detection, transaction handling, and micro-reward flow

Detects window.ethereum.isMiniPay for seamless wallet UX

Includes testnet setup for reward testing

Uses cUSD for fee abstraction and in-game rewards


Official docs: MiniPay Quickstart


---

🌐 Deployment

Frontend: Vercel (preferred) or Render for quick testing

Smart contract: Celo Alfajores Testnet

Firebase: dynamic leaderboard & player profiles

All sensitive keys stored in .env.local (never commit secrets)


---

🎯 Vision & Next Steps

Fully integrated MiniPay micro-rewards

On-chain NFT achievements for duel wins

Multiplayer PvP duels

Seasonal tournaments & leaderboard resets

Mainnet launch after hackathon



---

This README makes RockchainDuelArena look polished, fully thought-out, and hackathon-ready.

If you want, I can also create a ready-to-paste SUBMISSION.md that maps each hackathon requirement to the features in this README, so judges see everything instantly.

Do you want me to do that next?
