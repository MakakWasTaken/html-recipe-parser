import parse from "node-html-parser";
import { IRecipe, ISchemaRecipe } from "../interfaces";
import {
  durationToText,
  getAuthor,
  getImage,
  getRating,
  getUrl,
  parseInstructions,
  parseVideo,
  parseRecipeToJSON,
} from "./helpers";

export function parseRecipe(html: string): IRecipe {
  const root = parse(html, {
    lowerCaseTagName: true,
  });
  const jsonLD = root.querySelector("script[type='application/ld+json']");
  if (!jsonLD) throw new Error("No JSON-LD found");
  const recipeRaw = parseRecipeToJSON(jsonLD.rawText);
  if (!recipeRaw) throw new Error("Error parsing recipe");
  const author = getAuthor(recipeRaw.author);
  const datePublished = recipeRaw.datePublished
    ? new Date(recipeRaw.datePublished)
    : undefined;
  const sourceUrl = getUrl(recipeRaw);
  const cookTime = recipeRaw.cookTime
    ? durationToText(recipeRaw.cookTime)
    : undefined;
  const imageUrl = getImage(recipeRaw.image);
  const keywords = recipeRaw.keywords
    ? recipeRaw.keywords.split(",").map((v) => v.trim())
    : [];
  const prepTime = recipeRaw.prepTime
    ? durationToText(recipeRaw.prepTime)
    : undefined;
  const ingredients = recipeRaw.recipeIngredient;
  const instructions = parseInstructions(recipeRaw.recipeInstructions);
  const category = Array.isArray(recipeRaw.recipeCategory)
    ? recipeRaw.recipeCategory
    : recipeRaw.recipeCategory
    ? [recipeRaw.recipeCategory]
    : undefined;
  const cuisine = Array.isArray(recipeRaw.recipeCuisine)
    ? recipeRaw.recipeCuisine
    : recipeRaw.recipeCuisine
    ? [recipeRaw.recipeCuisine]
    : undefined;
  const rating = getRating(recipeRaw.aggregateRating);
  const totalTime = recipeRaw.totalTime
    ? durationToText(recipeRaw.totalTime)
    : undefined;
  const yeld = recipeRaw.recipeYield;
  const { videoThumbnail, videoTitle, videoUrl } = parseVideo(recipeRaw.video);

  const recipe: IRecipe = {
    name: recipeRaw.name,
    author,
    datePublished,
    sourceUrl,
    cookTime,
    imageUrl,
    keywords,
    prepTime,
    ingredients,
    instructions,
    category,
    cuisine,
    rating,
    totalTime,
    yeld,
    videoThumbnail,
    videoTitle,
    videoUrl,
  };

  return recipe;
}
