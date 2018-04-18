import * as THREE from "three";
import {INewScores, IBestScores} from "../../../../common/communication/types-racing";

export interface ITrack {
    name: string;
    description: string;
    startingZone: THREE.Line3;
    points: THREE.Vector3[];
    usesNumber: number;
    INewScores: INewScores[];
    IBestScores: IBestScores[];
}
