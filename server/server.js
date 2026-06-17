import app from './src/app.js';
import { env } from './src/config/env.js';
import connectDB from './src/shared/database/db.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
