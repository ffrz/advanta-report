// src/hooks/useImageProcessing.js
import { useCallback } from 'react';
import { resizeImage } from '../utils/imageUtils';

export const useImageProcessing = () => {
    const processImage = useCallback(async (file, maxWidth = 800, quality = 0.8) => {
        if (!file) return null;
        try {
            const resizedImageUrl = await resizeImage(file, maxWidth, quality);
            return resizedImageUrl;
        } catch (error) {
            console.error("Error processing image:", error);
            throw new Error("Gagal memproses gambar.");
        }
    }, []);

    return { processImage };
};