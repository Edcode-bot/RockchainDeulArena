# RockChain Duel Arena

## Overview

RockChain Duel Arena is a blockchain gaming platform built on Celo where users can play classic games like Rock Paper Scissors, Tic Tac Toe, Number Guessing, Coin Flip, and Dice Roll. Players connect their wallets to participate in duels and earn NFT rewards for wins. The platform features a comprehensive scoring system, daily rewards, achievements, and leaderboards to gamify the experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui and Tailwind CSS for consistent, accessible design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Custom React Context-based store for game state (points, NFTs, achievements, streaks)
- **Animations**: Framer Motion for smooth game interactions and transitions
- **Query Management**: TanStack React Query for server state management
- **Theme Support**: Dark/light mode with multi-language support (English/Swahili)

### Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **Development Setup**: Vite middleware integration for hot module replacement during development
- **API Structure**: RESTful endpoints prefixed with `/api` for game logic and user data
- **Build Process**: ESBuild for production server bundling
- **Storage Interface**: Abstracted storage layer with memory-based implementation for development

### Web3 Integration
- **Wallet Connection**: Reown AppKit (formerly WalletConnect) for wallet connectivity
- **Blockchain**: Celo network for low-cost transactions
- **Ethereum Compatibility**: Ethers.js adapter for blockchain interactions
- **User Authentication**: Wallet-based authentication with protected routes

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User management with username/password authentication
- **Migration System**: Drizzle Kit for database schema management and migrations
- **Development Storage**: In-memory storage implementation for local development

### Component Architecture
- **Design System**: Modular UI components with consistent styling via CSS variables
- **Responsive Design**: Mobile-first approach with bottom navigation for mobile devices
- **Game Components**: Individual game implementations with shared state management
- **Layout Components**: Header, navigation, and protected route wrappers

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query for frontend framework
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **TypeScript**: Full TypeScript support across client, server, and shared code

### Web3 Dependencies
- **Reown AppKit**: Wallet connection and management
- **Ethers.js**: Ethereum blockchain interactions
- **Celo Network**: Target blockchain for deployment

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Production bundling for server code
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database migration and management tools

### Database Integration
- **Neon Database**: Serverless PostgreSQL provider via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database queries and schema management
- **Connection Pooling**: PostgreSQL session management with `connect-pg-simple`

### Deployment
- **Vercel**: Production deployment platform with optimized static asset serving
- **Environment Variables**: Database connection strings and API keys managed through environment configuration