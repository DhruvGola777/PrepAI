import mammoth from 'mammoth';
import { createRequire } from 'module';
import cloudinary from './cloudinary.js';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Extract text from a PDF or Word document given a local path or remote URL.
 * @param {string} source - URL or local file path
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromResume = async (source, mimeType) => {
  try {
    let buffer;
    let finalUrl = source;

    // 1. Get buffer from URL or local path
    if (source.startsWith('http')) {
      // If it's a Cloudinary URL, try to generate a signed URL to avoid 401 Unauthorized
      if (source.includes('cloudinary.com')) {
        try {
          // Extract public_id from URL: .../upload/v12345/folder/public_id.ext
          const parts = source.split('/');
          const uploadIndex = parts.indexOf('upload');
          if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
            const versionMatch = parts[uploadIndex + 1].match(/^v(\d+)$/);
            const version = versionMatch ? versionMatch[1] : undefined;
            
            const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
            const lastDotIndex = publicIdWithExt.lastIndexOf('.');
            const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
            const extension = lastDotIndex !== -1 ? publicIdWithExt.substring(lastDotIndex + 1) : '';
            
            // Generate signed URL with explicit format and type
            finalUrl = cloudinary.url(publicId + (extension ? `.${extension}` : ''), {
              sign_url: true,
              secure: true,
              version,
              resource_type: source.includes('/image/') ? 'image' : 'raw',
              type: 'upload',
              analytics: false
            });
          }
        } catch (err) {
          console.error('Error generating signed Cloudinary URL:', err);
          // Fallback to original URL if parsing fails
        }
      }

      const response = await fetch(finalUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch file from URL (${finalUrl}): ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Assuming local file path (though project seems to use Cloudinary URLs)
      const fs = await import('fs/promises');
      buffer = await fs.readFile(source);
    }

    // 2. Parse based on mime type
    if (mimeType === 'application/pdf' || source.toLowerCase().endsWith('.pdf')) {
      // The version of pdf-parse installed (v2.x) uses a class-based API
      const PDFParseClass = pdf.PDFParse || pdf;
      
      try {
        const parser = new PDFParseClass({ data: buffer });
        const result = await parser.getText();
        return result.text;
      } catch (err) {
        // Fallback for older versions or different builds if PDFParse class fails
        if (typeof PDFParseClass === 'function' && !PDFParseClass.prototype?.getText) {
          const data = await PDFParseClass(buffer);
          return data.text;
        }
        throw err;
      }
    } 
    
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      source.toLowerCase().endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new Error(`Unsupported file type: ${mimeType || 'unknown'}`);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};
