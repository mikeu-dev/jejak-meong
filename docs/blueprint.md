# **App Name**: Jejak Meong

## Core Features:

- Cat Information Input: Capture cat's name, gender, and type using text inputs.
- Image Upload: Allow users to upload an image of the cat. The app will then generate suggested breeds for the user.
- Location Pinning: Enable users to pin the last seen location of the cat on a MapView.
- Data Storage: Store cat data, including image URL, location, and other details in Firestore.
- Map Display: Display all pinned cats on a MapView with markers.
- Marker Information Display: On click of a marker, display cat details such as name, gender, type, and image. All actions will use async/await.
- Breed Tool Suggestion: Using an LLM as a tool, attempt to detect and provide suggestions for possible breeds, based on the provided image of the animal. The app will show an input field for the user to make their own suggestion, if the models results are insufficient.

## Style Guidelines:

- Primary color: Soft orange (#FFB347) to bring warmth and friendliness.
- Background color: Light beige (#F5F5DC) to create a soft, neutral background.
- Accent color: Light green (#90EE90) for interactive elements and highlights.
- Body and headline font: 'PT Sans', a sans-serif for modern legibility. Note: currently only Google Fonts are supported.
- Use simple, clear icons to represent different cat types and actions.
- Employ a mobile-friendly layout with clear sections for input, map, and cat details.
- Implement smooth transitions and feedback animations for user interactions.