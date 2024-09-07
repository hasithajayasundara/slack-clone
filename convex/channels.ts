import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const get = query({
  args: {
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const member = await ctx.db.query("members")
      .withIndex(
        "by_workspace_id_user_id",
        (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique();

    if (!member) {
      return [];
    }

    const channels = await ctx.db.query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return channels;
  }
});

export const create = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query("members")
      .withIndex(
        "by_workspace_id_user_id",
        (q) => q.eq("workspaceId", args.id).eq("userId", userId)
      ).unique();

    if (!member) {
      throw new Error('Unauthorized');
    }

    await ctx.db.insert("channels", {
      workspaceId: args.id,
      name: args.name,
    });

    return args.id;
  }
});
