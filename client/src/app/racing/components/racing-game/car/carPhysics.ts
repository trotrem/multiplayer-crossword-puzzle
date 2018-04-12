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
            this.getTotalTorque(car) / (car.rearWheel.inertia * NUMBER_REAR_WHEELS)
        );
    }
    public static getDeltaSpeed(car: Car, deltaTime: number): Vector3 {
        return this.getAcceleration(car).multiplyScalar(deltaTime);
    }
    // should be in car-physics (deltaSpeed (car), getWeightDistribution (car) )
    private static getAcceleration(car: Car): Vector3 {
        return this.getLongitudinalForce(car).divideScalar(car.mass);
    }
    // should be in car-physics (getAcceleration)
    private static getLongitudinalForce(car: Car): Vector3 {
        const resultingForce: Vector3 = new Vector3();
        if (car._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce(car.direction, car.dragCoefficient, car.speed);
            const rollingResistance: Vector3 = this.getRollingResistance(car.speed, car.direction, car.mass);
            resultingForce.add(dragForce).add(rollingResistance);
        }
        if (car.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce(car);
            const accelerationForce: Vector3 = car.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (car.isBraking && this.isGoingForward(car.speed, car.direction)) {
            const brakeForce: Vector3 = this.getBrakeForce(car.rearWheel, car.mass, car.direction);
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
            this.getTractionTorque(car) * NUMBER_REAR_WHEELS + this.getBrakeTorque(car.rearWheel, car.mass, car.direction)
        );
    }
    // should be in car-physics(Get Total torque)
    private static getTractionTorque(car: Car): number {
        return this.getTractionForce(car) * car.rearWheel.radius;
    }
    // should be in car-physics(Get tractionTroque, getLongitudinalForce )
    private static getTractionForce(car: Car): number {
        const force: number = this.getEngineForce(car.engine, car.rearWheel);
        const maxForce: number = car.rearWheel.frictionCoefficient * car.mass * GRAVITY * car.weightRear *
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
