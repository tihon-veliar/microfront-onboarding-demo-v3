import type { Metadata } from "next";

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
export const fallbackTitle = "Neo Bestiary";
export const fallbackDescription = "A digital bestiary of creatures, taxonomy, and field notes.";
export const fallbackImage: NonNullable<Metadata["openGraph"]>["images"] = ["/bg.png"];
