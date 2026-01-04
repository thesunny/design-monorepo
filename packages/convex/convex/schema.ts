import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  favorites: defineTable({
    userId: v.string(),
    fontName: v.string(),
    weight: v.number(),
    type: v.optional(v.union(v.literal("heading"), v.literal("text"))),
  }).index("by_user", ["userId"]),
});
