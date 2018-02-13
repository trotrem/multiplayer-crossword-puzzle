let mongoose = require("mongoose");
let Three = require("three");


let tracksSchema = new mongoose.Schema({
    name : {type :String, required : true, unique : true},
    description : {type : String, default : "This is a track"},
    startingZone: Three.Vector3,
    points: Three.Vector3
});

export let tracks = mongoose.model("Tracks", tracksSchema);
mongoose.Promise= global.Promise;
mongoose.connect("mongodb://read_bool:projet22018@ds035290.mlab.com:35290/projet2_07").catch((err:any) => {console.log(err)})