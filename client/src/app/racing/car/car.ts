import { Vector3, Matrix4, Object3D, Euler, Quaternion, Box3 } from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../constants";
import { Wheel } from "./wheel";
import { CarLoader } from "./car-loader";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { ILine } from "../dataStructures";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MAX_WEIGHT_DISTRIBUTION: number = 0.75;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const RADIUS: number = 3.6;
const PERCENTAGE: number = 100;
const COEFFICIENT_DEGREE: number = 0.01;
const COEFFICIENT_USE: number = 0.0095;
const COEFFICIENT_USES: number = 0.005;

const WIDTH: number = 0.9741033263794181;
const LENGTH: number = 3.3948105126565693;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;
    private carLoader: CarLoader;

    private _speed: Vector3;
    private _velocity: Vector3;
    private isBraking: boolean;
    private _mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;
    private updatedPosition: Vector3;
    private lapTimes: number[];

    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public getCorners(pos: Vector3): Vector3[] {
        return [
            pos.add(this.direction.multiplyScalar(LENGTH / 2).add(
                this.direction.cross(
                    new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)
                )
            )
            ),
            pos.add(this.direction.multiplyScalar(LENGTH / 2).sub(
                this.direction.cross(
                    new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)
                )
            )
            ),
            pos.sub(this.direction.multiplyScalar(LENGTH / 2).add(
                this.direction.cross(
                    new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)
                )
            )
            ),
            pos.sub(this.direction.multiplyScalar(LENGTH / 2).sub(
                this.direction.cross(
                    new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)
                )
            )
            )
        ];
    }

    public get mesh(): Object3D {
        return this._mesh;
    }

    private get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public constructor(
        private collisionService: WallsCollisionsService,
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT
    ) {
        super();

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }

        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }
        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.mass = mass;
        this.dragCoefficient = dragCoefficient;
        this.carLoader = new CarLoader();
        this.updatedPosition = new Vector3();

        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.lapTimes = new Array<number>();
    }

    public async init(): Promise<void> {
        this._mesh = await this.carLoader.load();
        this._mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.add(this._mesh);
    }

    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }

    public releaseBrakes(): void {
        this.isBraking = false;
    }

    public brake(): void {
        this.isBraking = true;
    }
    public getUpdatedPosition(): Vector3 {
        return this.updatedPosition.clone();
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this._mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        this.physicsUpdate(deltaTime);

        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const R: number =
            DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this._mesh.rotateY(omega);
    }

    public getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(
            this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length()
        );
        if (!this.collisionService.willCollide(this)) {
            this._mesh.position.add(this.getDeltaPosition(deltaTime));
            this.rearWheel.update(this.speed.length());
        }
        this.updatedPosition = this._mesh.position;
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        const distribution: number =
            this.mass +
            1 / this.wheelbase * this.mass * acceleration / NUMBER_REAR_WHEELS;

        return Math.min(
            Math.max(MAXIMUM_STEERING_ANGLE, distribution),
            MAX_WEIGHT_DISTRIBUTION
        );
    }

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance);
        }

        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        }

        return resultingForce;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html

        const rollingCoefficient: number =
            1 /
            tirePressure *
            (Math.pow(
                this.speed.length() * RADIUS / PERCENTAGE,
                NUMBER_REAR_WHEELS
            ) *
                COEFFICIENT_USE +
                COEFFICIENT_DEGREE) +
            COEFFICIENT_USES;

        return this.direction.multiplyScalar(
            rollingCoefficient * this.mass * GRAVITY
        );
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(
            airDensity *
            carSurface *
            -this.dragCoefficient *
            this.speed.length() *
            this.speed.length()
        );

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient *
            this.mass *
            GRAVITY *
            this.weightRear *
            NUMBER_REAR_WHEELS /
            NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return (
            this.getTotalTorque() / (this.rearWheel.inertia * NUMBER_REAR_WHEELS)
        );
    }

    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY
        );
    }

    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }

    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }

    private getTotalTorque(): number {
        return (
            this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque()
        );
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this.mass);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private isGoingForward(): boolean {
        return this.speed.normalize().dot(this.direction) > MINIMUM_SPEED;
    }

    public getLabTimes(): number[] {
        return this.lapTimes;
    }

    public setLabTimes(time: number): void {
        time /= MS_TO_SECONDS;
        for (let i: number = 1; i < this.lapTimes.length + 1; i++) {
            time -= this.lapTimes[this.lapTimes.length - i];
        }
        this.lapTimes.push(time);
    }
}

