import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";

export * from "./auth.schema";

export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(), 
    languageCode: text("language_code").notNull(), 
    category: text("category").notNull() 
});

export const vocabulary = pgTable("vocabulary", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), 
    targetWord: text("target_word").notNull(),
    english: text("english").notNull(),
    contextSentence: text("context_sentence"),
    languageCode: text("language_code").notNull(),
    strength: integer("strength").default(0)
});