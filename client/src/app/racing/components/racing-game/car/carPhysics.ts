import { Vector3, Euler } from "three";
import { Wheel } from "./wheel";
import { Car } from "./car";
import { GRAVITY } from "../../../../constants";
import { Engine } from "./engine";

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const MAX_WEIGHT_DISTRIBUTION: number = 0.75;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const RADIUS: number = 3.6;
const PERCENTAGE: number = 100;
const COEFFICIENT_DEGREE: number = 0.01;
const COEFFICIENT_USE: number = 0.0095;
const COEFFICIENT_USES: number = 0.005;

export class CarPhysics {
    // should be in car-physics
    public static getWeightDistribution(car: Car, mass: number, wheelbase: number): number {
        const acceleration: number = this.getAcceleration(car).length();
        const distribution: number = mass + 1 / wheelbase * mass * acceleration / NUMBER_REAR_WHEELS;

        return Math.min(
            Math.max(MAXIMUM_STEERING_ANGLE, distribution),
            MAX_WEIGHT_DISTRIBUTION
        );
    }
    // should be in car-physics
    public static getAngularAcceleration(car: Car): number {
        return (
            this.getTotalTorque(car) / (car.RearWheel.inertia * NUMBER_REAR_WHEELS)
        );
    }
    public static getDeltaSpeed(car: Car, deltaTime: number): Vector3 {
        return this.getAcceleration(car).multiplyScalar(deltaTime);
    }
    // should be in car-physics (deltaSpeed (car), getWeightDistribution (car) )
    private static getAcceleration(car: Car): Vector3 {
        return this.getLongitudinalForce(car).divideScalar(car.Mass);
    }
    // should be in car-physics (getAcceleration)
    private static getLongitudinalForce(car: Car): Vector3 {
        const resultingForce: Vector3 = new Vector3();
        if (car.speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce(car.direction, car.DragCoefficient, car.speed);
            const rollingResistance: Vector3 = this.getRollingResistance(car.speed, car.direction, car.Mass);
            resultingForce.add(dragForce).add(rollingResistance);
        }
        if (car.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce(car);
            const accelerationForce: Vector3 = car.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (car.isBraking && this.isGoingForward(car.speed, car.direction)) {
            const brakeForce: Vector3 = this.getBrakeForce(car.RearWheel, car.Mass, car.direction);
            resultingForce.add(brakeForce);
        }

        return resultingForce;
    }
    // should be in car-physics (getLongitudinalForce)
    private static getRollingResistance(speed: Vector3, direction: Vector3, mass: number): Vector3 {
        const tirePressure: number = 1;
        const rollingCoefficient: number = 1 / tirePressure * (Math.pow(speed.length() * RADIUS / PERCENTAGE, NUMBER_REAR_WHEELS) *
            COEFFICIENT_USE + COEFFICIENT_DEGREE) + COEFFICIENT_USES;

        return direction.multiplyScalar(
            rollingCoefficient * mass * GRAVITY
        );
    }
    // should be in car-physics (getLongitudinalForce)
    private static getDragForce(direction: Vector3, dragCoefficient: number, speed: Vector3): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = direction;
        resistance.multiplyScalar(airDensity * carSurface * - dragCoefficient * speed.length() * speed.length());

        return resistance;
    }
    // should be in car-physics (getAngularAcceleration)
    private static getTotalTorque(car: Car): number {
        return (
            this.getTractionTorque(car) * NUMBER_REAR_WHEELS + this.getBrakeTorque(car.RearWheel, car.Mass, car.direction)
        );
    }
    // should be in car-physics(Get Total torque)
    private static getTractionTorque(car: Car): number {
        return this.getTractionForce(car) * car.RearWheel.radius;
    }
    // should be in car-physics(Get tractionTroque, getLongitudinalForce )
    private static getTractionForce(car: Car): number {
        const force: number = this.getEngineForce(car.Engine, car.RearWheel);
        const maxForce: number = car.RearWheel.frictionCoefficient * car.Mass * GRAVITY * car.WeightRear *
            NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }
    // should be in car-physics (getTotalTorque)
    private static getBrakeTorque(rearWheel: Wheel, mass: number, direction: Vector3): number {
        return this.getBrakeForce(rearWheel, mass, direction).length() * rearWheel.radius;
    }

    // should be in car-physics (getBrakeTorque, get LongitunidalForce)
    private static getBrakeForce(rearWheel: Wheel, mass: number, direction: Vector3): Vector3 {
        return direction.multiplyScalar(
            rearWheel.frictionCoefficient * mass * GRAVITY
        );
    }

    // should be in car-physics (getTractionForce)
    private static getEngineForce(engine: Engine, rearWheel: Wheel): number {
        return engine.getDriveTorque() / rearWheel.radius;
    }

    private static isGoingForward(speed: Vector3, direction: Vector3): boolean {
        return speed.normalize().dot(direction) > MINIMUM_SPEED;
    }
}

/// ancien
    /*
    // should be in car-physics
    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        const distribution: number = this.mass + 1 / this.wheelbase * this.mass * acceleration / NUMBER_REAR_WHEELS;

        return Math.min(
            Math.max(MAXIMUM_STEERING_ANGLE, distribution),
            MAX_WEIGHT_DISTRIBUTION
        );
    }
    // should be in car-physics
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
    // should be in car-physics
    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        const rollingCoefficient: number = 1 / tirePressure * (Math.pow(this.speed.length() * RADIUS / PERCENTAGE, NUMBER_REAR_WHEELS) *
            COEFFICIENT_USE + COEFFICIENT_DEGREE) + COEFFICIENT_USES;

        return this.direction.multiplyScalar(
            rollingCoefficient * this.mass * GRAVITY
        );
    }
    // should be in car-physics
    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * - this.dragCoefficient * this.speed.length() * this.speed.length());

        return resistance;
    }
    // should be in car-physics
    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number = this.rearWheel.frictionCoefficient * this.mass * GRAVITY * this.weightRear *
            NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }
    // should be in car-physics
    private getAngularAcceleration(): number {
        return (
            this.getTotalTorque() / (this.rearWheel.inertia * NUMBER_REAR_WHEELS)
        );
    }
    // should be in car-physics
    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY
        );
    }
    // should be in car-physics
    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }
    // should be in car-physics
    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }
    // should be in car-physics
    private getTotalTorque(): number {
        return (
            this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque()
        );
    }
    // should be in car-physics
    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }
    // should be in car-physics
    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this.mass);
    }
    // should be in car-physics
    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }*/
