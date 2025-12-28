import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;
    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addFavorite = mutation({
  args: {
    fontId: v.string(),
    fontName: v.string(),
    weight: v.number(),
    lineHeight: v.number(),
    letterSpacing: v.number(),
    type: v.union(v.literal("heading"), v.literal("paragraph"), v.literal("code")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Check if already favorited with same settings and type
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("fontId"), args.fontId),
          q.eq(q.field("weight"), args.weight),
          q.eq(q.field("lineHeight"), args.lineHeight),
          q.eq(q.field("letterSpacing"), args.letterSpacing),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      userId,
      fontId: args.fontId,
      fontName: args.fontName,
      weight: args.weight,
      lineHeight: args.lineHeight,
      letterSpacing: args.letterSpacing,
      type: args.type,
      createdAt: Date.now(),
    });
  },
});

export const removeFavorite = mutation({
  args: {
    fontId: v.string(),
    weight: v.number(),
    lineHeight: v.number(),
    letterSpacing: v.number(),
    type: v.union(v.literal("heading"), v.literal("paragraph"), v.literal("code")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("fontId"), args.fontId),
          q.eq(q.field("weight"), args.weight),
          q.eq(q.field("lineHeight"), args.lineHeight),
          q.eq(q.field("letterSpacing"), args.letterSpacing),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
