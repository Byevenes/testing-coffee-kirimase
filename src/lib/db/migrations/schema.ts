import { pgTable, text, timestamp, serial, integer, varchar, boolean, real, json, primaryKey } from "drizzle-orm/pg-core"

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});

export const computers = pgTable("computers", {
	id: serial("id").primaryKey().notNull(),
	brand: text("brand").notNull(),
	cores: integer("cores").notNull(),
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
});

export const books = pgTable("books", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	author: varchar("author", { length: 256 }).notNull(),
	pages: integer("pages").notNull(),
	read: boolean("read").notNull(),
	userId: varchar("user_id", { length: 256 }).notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const products = pgTable("products", {
	id: serial("id").primaryKey().notNull(),
	productName: text("product_name").notNull(),
	description: text("description"),
	unitPrice: real("unit_price").notNull(),
	unitInStock: integer("unit_in_stock").default(0).notNull(),
	unitOnOrder: integer("unit_on_order").default(0).notNull(),
	discontinued: integer("discontinued").default(0),
	images: json("images").default(null),
	points: integer("points").default(0),
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
	(table) => {
		return {
			verificationtokenIdentifierToken: primaryKey(table.identifier, table.token)
		}
	});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
	(table) => {
		return {
			accountProviderProvideraccountid: primaryKey(table.provider, table.providerAccountId)
		}
	});