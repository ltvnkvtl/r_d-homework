import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userScheme = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    token: { type: String, required: false },
});
export default mongoose.model('User', userScheme);
