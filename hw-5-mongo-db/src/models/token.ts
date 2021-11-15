import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// const tokenScheme = new Schema({
//   userId: { type: String, required: true, unique: true },
//   tokens: { type: [String], default: [] },
// }, { _id: false });

const tokenScheme = new Schema({
  tokenMap: { type: Map, of: [String], default: {} },
});

export default mongoose.model("Token", tokenScheme);
