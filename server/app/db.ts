import * as mongoose from "mongoose";
import * as THREE from "three";
const tracksSchema: mongoose.Schema = new mongoose.Schema({
    name : {type : String, required : true, unique : true},
    description : {type : String, default : "This is a track"},
    startingZone: THREE.Line3,
    points: Array(THREE.Vector3)
});

export let tracks: mongoose.Model<mongoose.Document> = mongoose.model("Tracks", tracksSchema);
require("mongoose").Promise = global.Promise ;
mongoose.connect("mongodb://read_bool:projet22018@ds035290.mlab.com:35290/projet2_07").catch(
    (err: Error) => console.error(err));