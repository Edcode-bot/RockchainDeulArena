import { z } from 'zod';

// User schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  address: z.string().toLowerCase(),
  username: z.string().min(1).max(50).optional(),
  points: z.number().default(0),
  nfts: z.array(z.string()).default([]),
  streak: z.number().default(0),
  rank: z.number().default(0),
  avatar: z.string().optional(),
  lastDailyClaimAt: z.date().optional(),
  refClaims: z.array(z.object({
    referrer: z.string(),
    at: z.date()
  })).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export const InsertUserSchema = UserSchema.omit({ _id: true });
export const UpdateUserSchema = UserSchema.partial().omit({ _id: true, createdAt: true });

export type User = z.infer<typeof UserSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// Game result schema
export const GameResultSchema = z.object({
  _id: z.string().optional(),
  address: z.string().toLowerCase(),
  gameId: z.enum(['rps', 'coin', 'dice', 'guess', 'tictactoe', 'blackjack', 'memory', '2048', 'reaction', 'scramble']),
  result: z.enum(['win', 'loss', 'draw']),
  betAmount: z.string().optional(), // ETH amount as string
  txHash: z.string().optional(), // Divvi transaction hash
  pointsDelta: z.number(),
  nftUri: z.string().optional(),
  createdAt: z.date().default(() => new Date())
});

export const InsertGameResultSchema = GameResultSchema.omit({ _id: true });

export type GameResult = z.infer<typeof GameResultSchema>;
export type InsertGameResult = z.infer<typeof InsertGameResultSchema>;

// API request schemas
export const AuthRequestSchema = z.object({
  address: z.string(),
  signature: z.string(),
  message: z.string(),
  username: z.string().min(1).max(50).optional()
});

export const DailyClaimRequestSchema = z.object({
  address: z.string(),
  signature: z.string(),
  message: z.string()
});

export const ReferralClaimRequestSchema = z.object({
  address: z.string(),
  referrer: z.string(),
  signature: z.string(),
  message: z.string()
});

export const GameResultRequestSchema = z.object({
  address: z.string(),
  gameId: z.string(),
  result: z.enum(['win', 'loss', 'draw']),
  betAmount: z.string().optional(),
  txHash: z.string().optional(),
  signature: z.string(),
  message: z.string()
});

export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type DailyClaimRequest = z.infer<typeof DailyClaimRequestSchema>;
export type ReferralClaimRequest = z.infer<typeof ReferralClaimRequestSchema>;
export type GameResultRequest = z.infer<typeof GameResultRequestSchema>;