export interface Track {
    name: string ;
    description: string;
    startingZone: THREE.Line3;
    points: THREE.Vector3[];
    usesNumber: number;
    bestScores: number[];
}
