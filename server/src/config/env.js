import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT : process.env.PORT || 5000 ,
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    OPENAI_API_KEY : process.env.OPENAI_API_KEY,
    GROQ_API_KEY : process.env.GROQ_API_KEY,
    }