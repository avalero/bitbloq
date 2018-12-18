import { ICartesian, SphericalCoords } from "./SphericalCoordinates";
/* The polar angle (phi) is measured from the positive z-axis. The positive z-axis is up.
 * The azimuthal angle (theta) is measured from the positive x-axis.
 */
export class SphericalCoordsXYZ extends SphericalCoords {
  public get cartesian(): ICartesian {
    return SphericalCoordsXYZ.toCartesian(this.radius, this.phi, this.theta);
  }
  public static toCartesian(r: number, phi: number, theta: number): ICartesian {
    const rSinphi: number = r * Math.sin(phi);
    const x: number = Math.cos(theta) * rSinphi;
    const y: number = Math.sin(theta) * rSinphi;
    const z: number = r * Math.cos(phi);
    return { x, y, z };
  }
  constructor(r: number = 0, phi: number = 0, theta: number = 0) {
    super(r, phi, theta);
  }
  public setFromCartesianCoords(
    x: number,
    y: number,
    z: number
  ): SphericalCoords {
    this.radius = Math.sqrt(x * x + y * y + z * z);
    this.theta =
      x !== 0 ? Math.atan(y / x) : y > 0 ? Math.PI / 2 : -Math.PI / 2;
    this.phi = Math.acos(z / this.radius);
    return this;
  }
}
