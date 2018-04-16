import { Vector3, Matrix4, Object3D, Euler, Quaternion } from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../../../../constants";
import { Wheel } from "./wheel";
import { CarLoader } from "./car-loader";
import { WallsCollisionsService } from "../walls-collisions-service/walls-collisions-service";
import { KeyboardService } from "../commands/keyboard.service";
import * as Command from "../commands/concrete-commands/headers";
import * as KeyCode from "../commands/key-code";
import { CarPhysics } from "./carPhysics";
import { CarController } from "./carController";
import { WallService } from "../walls-collisions-service/walls";

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
const WALL_SPEED_LOSS: number = 0.5;
const MIN_WALL_SPEED: number = 4;

const WIDTH: number = 0.9741033263794181;
const LENGTH: number = 3.3948105126565693;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;
    public carController: CarController;
    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;
    private carLoader: CarLoader;

    private _speed: Vector3;
    private _velocity: Vector3;
    public isBraking: boolean;
    public mesh: Object3D;
    protected steeringWheelDirection: number;
    private weightRear: number;
    private updatedPosition: Vector3;
    private lapTimes: number[];
    public  checkpoint: number;

    public get Engine(): Engine {
        return this.engine;
    }
    public get Mass(): number {
        return this.mass;
    }
    public get RearWheel(): Wheel {
        return this.rearWheel;
    }
    public get DragCoefficient(): number {
        return this.dragCoefficient;
    }
    public get WeightRear(): number {
        return this.weightRear;
    }
    public set speed(speed: Vector3) {
        this._speed = speed;
    }
    public get speed(): Vector3 {
        return this._speed.clone();
    }
    public get velocity(): Vector3 {
        return this._velocity.clone();
    }
    public get currentGear(): number {
        return this.engine.currentGear;
    }
    public get rpm(): number {
        return this.engine.rpm;
    }
    public get angle(): number {
        return this.mesh.rotation.y * RAD_TO_DEG;
    }
    public set steeringWheel(direction: number) {
        this.steeringWheelDirection = direction;
    }

    public getCorners(pos: Vector3): Vector3[] {
        return [
            pos.clone().add(this.direction.multiplyScalar(LENGTH / 2).add(
                this.direction.cross(new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)))),
            pos.clone().add(this.direction.multiplyScalar(LENGTH / 2).sub(
                this.direction.cross(new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)))),
            pos.clone().sub(this.direction.multiplyScalar(LENGTH / 2).add(
                this.direction.cross(new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2)))),
            pos.clone().sub(this.direction.multiplyScalar(LENGTH / 2).sub(
                this.direction.cross(new Vector3(0, 0, 1).normalize().multiplyScalar(WIDTH / 2))))];
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this.mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }
    public get updatePosition(): Vector3 {
        return this.updatedPosition;
    }
    //TODO : extraire construteur? : Sarah
    public constructor(
        private collisionService: WallsCollisionsService, private wallService: WallService, private keyboard: KeyboardService,
        engine: Engine = new Engine(), rearWheel: Wheel = new Wheel(), wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS, dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
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
        this.checkpoint = 0;
    }
    public async init(): Promise<void> {
        this.carController = new CarController(this);
        this.mesh = await this.carLoader.load();
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.add(this.mesh);
    }
    public getUpdatedPosition(): Vector3 {
        return this.updatedPosition.clone();
    }
    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;
        // Move to car coordinates (extract)
        this._speed.applyMatrix4(this.setRotationMatrix());
        // Physics calculations
        this.physicsUpdate(deltaTime);
        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(this.setRotationQuaternion().inverse());
        // Angular rotation of the car
        this.setAngularRotation(deltaTime);
    }
    private setRotationMatrix(): Matrix4 {
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this.mesh.matrix);

        return rotationMatrix;
    }
    private setRotationQuaternion(): Quaternion {
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(this.setRotationMatrix());

        return rotationQuaternion;
    }
    private setAngularRotation(deltaTime: number): void {
        const R: number =
            DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this.mesh.rotateY(omega);
    }
    public getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }
    private physicsUpdate(deltaTime: number): void {
        this.rearWheel._angularVelocity += CarPhysics.getAngularAcceleration(this) * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = CarPhysics.getWeightDistribution(this, this.mass, this.wheelbase);
        this._speed.add(CarPhysics.getDeltaSpeed(this, deltaTime));
        this._speed.setLength(
            this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length()
        );
        this._velocity = this.getDeltaPosition(deltaTime);
        for (const collisionNormal of this.collisionService.getCollisionNormal(this, this.wallService.walls)) {
            this._speed.setLength(Math.max(this._speed.length() - WALL_SPEED_LOSS, Math.min(this._speed.length(), MIN_WALL_SPEED)));
            this._velocity.sub(collisionNormal.clone().multiplyScalar(this._velocity.dot(collisionNormal)));
        }
        this.mesh.position.add(this._velocity);
        this.rearWheel.update(this.speed.length());
        this.updatedPosition = this.mesh.position;
    }
    public getLapTimes(): number[] {
        return this.lapTimes;
    }
    public setLapTimes(time: number): number {
        for (let i: number = 1; i < this.lapTimes.length + 1; i++) {
            time -= this.lapTimes[this.lapTimes.length - i];
        }
        this.lapTimes.push(time);

        return time;
    }
    public initCommands(): void {
        this.keyboard.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.AccelerationCommand(this));
        this.keyboard.addCommand(KeyCode.LEFT_KEYCODE, new Command.SteerLeftCommand(this));
        this.keyboard.addCommand(KeyCode.RIGHT_KEYCODE, new Command.SteerRightCommand(this));
        this.keyboard.addCommand(KeyCode.BRAKE_KEYCODE, new Command.BrakeCommand(this));
        this.keyboard.addCommand(KeyCode.LEFT_KEYCODE, new Command.ReleaseSteerCommand(this));
        this.keyboard.addCommand(KeyCode.RIGHT_KEYCODE, new Command.ReleaseSteerCommand(this));
        this.keyboard.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.DecelerateCommand(this));
        this.keyboard.addCommand(KeyCode.BRAKE_KEYCODE, new Command.ReleaseBrakesCommand(this));
    }
}
