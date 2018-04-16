export const DEFAULT_WHEEL_RADIUS: number = 0.3505; // 245/50R18
export const DEFAULT_WHEEL_MASS: number = 15;
export const DEFAULT_FRICTION_COEFFICIENT: number = 1;
const RADIUS_COEFFICIENT: number = 2;

export class Wheel {
    public angularVelocity: number;
    private _mass: number;
    private _radius: number;
    private _frictionCoefficient: number;

    public get inertia(): number {
        return this._mass * this._radius * this._radius / RADIUS_COEFFICIENT;
    }

    public get radius(): number {
        return this._radius;
    }

    public get frictionCoefficient(): number {
        return this._frictionCoefficient;
    }

    public get mass(): number {
        return this._mass;
    }

    public constructor(
        mass: number = DEFAULT_WHEEL_MASS,
        radius: number = DEFAULT_WHEEL_RADIUS,
        frictionCoefficient: number = DEFAULT_FRICTION_COEFFICIENT) {
        if (mass <= 0) {
            console.error("Mass cannot be <= 0. Reverting to default value.");
            mass = DEFAULT_WHEEL_MASS;
        }

        if (radius <= 0) {
            console.error("Radius cannot be <= 0. Reverting to default value.");
            radius = DEFAULT_WHEEL_RADIUS;
        }

        if (frictionCoefficient <= 0) {
            console.error("Friction coefficient cannot be <= 0. Reverting to default value.");
            frictionCoefficient = DEFAULT_FRICTION_COEFFICIENT;
        }

        this._mass = mass;
        this._radius = radius;
        this._frictionCoefficient = frictionCoefficient;
        this.angularVelocity = 0;
    }

    public update(speed: number): void {
        this.angularVelocity = speed / this.radius;
    }
}
