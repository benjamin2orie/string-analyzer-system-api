
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();


const connectToDatabase = async(): Promise<void> => {
    const DB_URI = process.env.DB_URI as string || '';
    if (!DB_URI) {
        throw new Error('Database URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(DB_URI);
        console.log('✅Database connected successfully');
    } catch (error) {
        console.error(' ❌Database connection error:', error);
        
    }
}

export default connectToDatabase;