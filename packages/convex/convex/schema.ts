import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  favorites: defineTable({
    userId: v.string(),
    fontId: v.string(),
    fontName: v.string(),
    weight: v.number(),
    lineHeight: v.number(),
    letterSpacing: v.number(),
    type: v.optional(v.union(v.literal("heading"), v.literal("paragraph"), v.literal("code"))),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
