import * as mongoose from "mongoose";

const crosswordSchema: mongoose.Schema = new mongoose.Schema({
    grid: { type: Object, required: true },
    difficulty: { type: Number, required: true }
});

export let crosswordDocument: mongoose.Model<mongoose.Document> = mongoose.model("Grids", crosswordSchema);
