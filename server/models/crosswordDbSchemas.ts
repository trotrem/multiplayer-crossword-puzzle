import * as mongoose from "mongoose";

const crosswordSchema: mongoose.Schema = new mongoose.Schema({
    grid: { type: Object, required: true },
    difficulty: { type: String, required: true }
});

export let CrosswordDocument: mongoose.Model<mongoose.Document> = mongoose.model("Grids", crosswordSchema);
