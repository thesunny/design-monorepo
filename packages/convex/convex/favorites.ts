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
    fontName: v.string(),
    weight: v.number(),
    type: v.union(v.literal("heading"), v.literal("text")),
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
          q.eq(q.field("fontName"), args.fontName),
          q.eq(q.field("weight"), args.weight),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      userId,
      fontName: args.fontName,
      weight: args.weight,
      type: args.type,
    });
  },
});

export const removeFavorite = mutation({
  args: {
    fontName: v.string(),
    weight: v.number(),
    type: v.union(v.literal("heading"), v.literal("text")),
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
          q.eq(q.field("fontName"), args.fontName),
          q.eq(q.field("weight"), args.weight),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
