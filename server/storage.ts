import {
  users,
  subscriptions,
  prompts,
  usageLogs,
  type User,
  type UpsertUser,
  type Subscription,
  type InsertSubscription,
  type Prompt,
  type InsertPrompt,
  type UsageLog,
  type InsertUsageLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Subscription operations
  getUserSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Prompt operations
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getUserPrompts(userId: string): Promise<Prompt[]>;
  deletePrompt(promptId: string, userId: string): Promise<void>;
  clearUserPrompts(userId: string): Promise<void>;
  
  // Usage tracking
  getUserDailyUsage(userId: string): Promise<number>;
  incrementDailyUsage(userId: string): Promise<void>;
  checkRateLimit(userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Subscription operations
  async getUserSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));
    
    return subscription;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    
    return newSubscription;
  }

  // Prompt operations
  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const [newPrompt] = await db
      .insert(prompts)
      .values(prompt)
      .returning();
    
    return newPrompt;
  }

  async getUserPrompts(userId: string): Promise<Prompt[]> {
    return await db
      .select()
      .from(prompts)
      .where(eq(prompts.userId, userId))
      .orderBy(desc(prompts.createdAt))
      .limit(50);
  }

  async deletePrompt(promptId: string, userId: string): Promise<void> {
    await db
      .delete(prompts)
      .where(and(
        eq(prompts.id, promptId),
        eq(prompts.userId, userId)
      ));
  }

  async clearUserPrompts(userId: string): Promise<void> {
    await db
      .delete(prompts)
      .where(eq(prompts.userId, userId));
  }

  // Usage tracking
  async getUserDailyUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const [usage] = await db
      .select()
      .from(usageLogs)
      .where(and(
        eq(usageLogs.userId, userId),
        eq(usageLogs.date, today)
      ));
    
    return usage?.count || 0;
  }

  async incrementDailyUsage(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const [existing] = await db
      .select()
      .from(usageLogs)
      .where(and(
        eq(usageLogs.userId, userId),
        eq(usageLogs.date, today)
      ));
    
    if (existing) {
      await db
        .update(usageLogs)
        .set({ 
          count: (existing.count ?? 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(usageLogs.id, existing.id));
    } else {
      await db
        .insert(usageLogs)
        .values({
          userId,
          date: today,
          count: 1
        });
    }
  }

  async checkRateLimit(userId: string): Promise<boolean> {
    const currentUsage = await this.getUserDailyUsage(userId);
    const subscription = await this.getUserSubscription(userId);
    
    const limit = subscription?.plan === 'premium' ? 50 : 10;
    return currentUsage < limit;
  }
}

export const storage = new DatabaseStorage();
