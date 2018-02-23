import * as mongoose from "mongoose";

const tracksSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "This is a track" },
    startingZone: mongoose.Schema.Types.Mixed,
    points: Array(mongoose.Schema.Types.Mixed),
    usesNumber: {type: Number, default: 0}
});

export let tracks: mongoose.Model<mongoose.Document> = mongoose.model("Tracks", tracksSchema);
require("mongoose").Promise = global.Promise;
mongoose.connect("mongodb://read_bool:projet22018@ds035290.mlab.com:35290/projet2_07", { useMongoClient: true }, () => {

    // console.log("DB is connected")

});
