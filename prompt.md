# Virtual Try-On AI

This application uses generative AI to let you virtually try on clothing. Upload a photo of a person and a photo of an outfit, and the AI will generate an image of that person wearing the selected clothes.

## How It Works

The app sends both images to a multimodal AI model. The model analyzes the person's features, pose, and background from the first image, and the clothing item from the second image. It then synthesizes a new image combining these elements.

## How to Use

1.  **Upload Person Image**: Click the first box to upload a clear photo of a person. For best results, use a full-body or upper-body photo where the person is facing forward.
2.  **Upload Outfit Image**: Click the second box to upload a photo of the clothing you want to try on. Images of clothing on a mannequin, a hanger, or laid flat on a simple background work best.
3.  **Generate**: Click the "✨ Virtually Try On" button.
4.  **View Result**: The AI will generate a new image below the buttons. This may take a few moments.

## Example Prompts

This application doesn't use a text prompt from the user. The prompt is constructed from the two images you upload.

- **Person Image**: A photo of yourself standing in your room.
- **Outfit Image**: A product photo of a dress from an online store.

The AI will then generate an image of you in your room, wearing that dress.
