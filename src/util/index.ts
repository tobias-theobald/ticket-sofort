export const delay = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const b64ImageToImageSource = (imageDataBase64: string) => {
    return { uri: `data:image/png;base64,${imageDataBase64}` };
};
