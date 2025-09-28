'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting cat breeds based on an uploaded image.
 *
 * The flow takes an image of a cat as input and returns a list of suggested breeds.
 * It uses a multi-turn prompt to first identify features of the cat in the image, then uses those features to suggest possible breeds.
 *
 * @fileOverview
 * - `suggestCatBreedsFromImage`: The main function to trigger the breed suggestion flow.
 * - `SuggestCatBreedsFromImageInput`: The input type for the function, which includes the image data URI.
 * - `SuggestCatBreedsFromImageOutput`: The output type, which is a list of suggested cat breeds.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCatBreedsFromImageInputSchema = z.object({
  catImageDataUri: z
    .string()
    .describe(
      'A photo of a cat, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type SuggestCatBreedsFromImageInput = z.infer<
  typeof SuggestCatBreedsFromImageInputSchema
>;

const SuggestCatBreedsFromImageOutputSchema = z.object({
  suggestedBreeds: z.array(
    z.string().describe('A suggested breed for the cat in the image.')
  ),
});
export type SuggestCatBreedsFromImageOutput = z.infer<
  typeof SuggestCatBreedsFromImageOutputSchema
>;

export async function suggestCatBreedsFromImage(
  input: SuggestCatBreedsFromImageInput
): Promise<SuggestCatBreedsFromImageOutput> {
  return suggestCatBreedsFromImageFlow(input);
}

const catBreedFeaturesPrompt = ai.definePrompt({
  name: 'catBreedFeaturesPrompt',
  input: {schema: SuggestCatBreedsFromImageInputSchema},
  output: {schema: z.object({features: z.string()})},
  prompt: `You are an expert at identifying cat breeds. Please analyze the provided image and extract key features that can help in breed identification.

Consider aspects like fur length, color patterns, face shape, ear shape, and body size.  List the features as a simple string.

Image: {{media url=catImageDataUri}}`,
});

const suggestBreedsPrompt = ai.definePrompt({
  name: 'suggestBreedsPrompt',
  input: {schema: z.object({features: z.string()})},
  output: {schema: SuggestCatBreedsFromImageOutputSchema},
  prompt: `Based on the following features, suggest a list of possible cat breeds.

Features: {{{features}}}

Return ONLY the list of breeds in the format ["Breed 1", "Breed 2", "Breed 3"]. Do not say anything else.`, // Corrected Handlebars syntax here
});

const suggestCatBreedsFromImageFlow = ai.defineFlow(
  {
    name: 'suggestCatBreedsFromImageFlow',
    inputSchema: SuggestCatBreedsFromImageInputSchema,
    outputSchema: SuggestCatBreedsFromImageOutputSchema,
  },
  async input => {
    const featuresResult = await catBreedFeaturesPrompt(input);
    const breedsResult = await suggestBreedsPrompt({
      features: featuresResult.output!.features,
    });
    return breedsResult.output!;
  }
);
