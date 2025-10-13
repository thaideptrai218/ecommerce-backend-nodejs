import mongoose from 'mongoose';

class Database {
    private static instance: Database;

    private constructor() {
        this.connect();
    }

    private connect() {
        mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch(err => {
                console.error('Error connecting to MongoDB', err);
            });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database;
