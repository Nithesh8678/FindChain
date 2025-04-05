import { GoogleGenerativeAI } from "@google/generative-ai";
import { LostItem, FoundItem } from "./itemService";

// Define the MatchResult interface
export interface MatchResult {
  foundItem: FoundItem;
  matchResult: {
    matchPercentage: number;
    reason: string;
  };
}

// Get the Gemini API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if the API key is set
if (!GEMINI_API_KEY) {
  console.error("Gemini API key is not set. Please add it to your .env file.");
}

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

/**
 * Smart matching function that uses Gemini AI to compare lost and found items
 * @param lostItem The lost item report
 * @param foundItem The found item report
 * @returns A promise that resolves to a MatchResult with match percentage and reason
 */
export async function matchLostAndFound(
  lostItem: LostItem,
  foundItem: FoundItem
): Promise<{ matchPercentage: number; reason: string }> {
  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a detailed prompt for Gemini
    const prompt = `
      You are an AI assistant helping to match lost and found items. 
      Compare the following lost item with a found item and determine if they might be the same item.
      
      LOST ITEM:
      Name: ${lostItem.name}
      Category: ${lostItem.category}
      Location: ${lostItem.location}
      Date Lost: ${new Date(lostItem.dateLost).toLocaleDateString()}
      Description: ${lostItem.description}
      ${lostItem.reward ? `Reward: ${lostItem.reward}` : ""}
      ${lostItem.imageUrl ? `Image URL: ${lostItem.imageUrl}` : ""}
      
      FOUND ITEM:
      Name: ${foundItem.name}
      Category: ${foundItem.category}
      Location: ${foundItem.location}
      Date Found: ${new Date(foundItem.dateFound).toLocaleDateString()}
      Description: ${foundItem.description}
      ${foundItem.imageUrl ? `Image URL: ${foundItem.imageUrl}` : ""}
      
      Analyze these items and determine:
      1. The likelihood they are the same item (as a percentage)
      2. A detailed explanation of why you think they match or don't match
      
      Consider:
      - Similarity of names and descriptions
      - Category match
      - Location proximity
      - Time between loss and finding
      - Any distinctive features mentioned
      - Visual similarity if images are available
      
      Respond in the following JSON format:
      {
        "matchPercentage": number (0-100),
        "reason": "detailed explanation"
      }
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    try {
      const matchResult = JSON.parse(text);
      return {
        matchPercentage: matchResult.matchPercentage,
        reason: matchResult.reason,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      // Return a default response in case of parsing error
      return {
        matchPercentage: 0,
        reason: "Error analyzing match. Please try again.",
      };
    }
  } catch (error) {
    console.error("Error in matchLostAndFound:", error);
    // Return a default response in case of error
    return {
      matchPercentage: 0,
      reason: "Error analyzing match. Please try again.",
    };
  }
}

/**
 * Find potential matches for a lost item among all found items
 * @param lostItem The lost item to find matches for
 * @param foundItems Array of all found items
 * @param minMatchPercentage Minimum match percentage to consider (default: 50)
 * @returns A promise that resolves to an array of matches with their match results
 */
export async function findPotentialMatches(
  lostItem: LostItem,
  foundItems: FoundItem[],
  minMatchPercentage: number = 50
): Promise<MatchResult[]> {
  try {
    // Compare the lost item with ALL found items
    const matchPromises = foundItems.map((foundItem) =>
      matchLostAndFound(lostItem, foundItem).then((matchResult) => ({
        foundItem,
        matchResult,
      }))
    );

    // Wait for all comparisons to complete
    const allMatches = await Promise.all(matchPromises);

    // Filter matches by minimum percentage and sort by match percentage
    const potentialMatches = allMatches
      .filter(
        (match) => match.matchResult.matchPercentage >= minMatchPercentage
      )
      .sort(
        (a, b) => b.matchResult.matchPercentage - a.matchResult.matchPercentage
      );

    return potentialMatches;
  } catch (error) {
    console.error("Error in findPotentialMatches:", error);
    return [];
  }
}
