import * as THREE from "three";
import {INewScores, IBestScores} from "../../../../common/communication/interfaces";

export interface Track {
    name: string;
    description: string;
    startingZone: THREE.Line3;
    points: THREE.Vector3[];
    usesNumber: number;
    INewScores: INewScores[];
    IBestScores: IBestScores[];
}
