import * as mongoose from "mongoose";

const trackSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "This is a track" },
    startingZone: mongoose.Schema.Types.Mixed,
    points: Array(mongoose.Schema.Types.Mixed),
    usesNumber: {type: Number, default: 0},
    bestScores: { type: [Number], default: [0] }
});

export let trackDocument: mongoose.Model<mongoose.Document> = mongoose.model("Tracks", trackSchema);
