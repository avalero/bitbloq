/**
 * @author avalero / http://github.com/avalero
 *
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 */


class SphericalCoords {
  constructor(r = 0, phi = 0, theta = 0) {
    this.radius = r;
    this.phi = phi;
    this.theta = theta;
  }

  get sphericalGrads() {
    const rads = this.spherical;
    return { radius: rads.radius, phi: rads.phi * 180 / Math.PI, theta: rads.theta * 180 / Math.PI };
  }

  get spherical() {
    return { radius: this.radius, phi: this.phi, theta: this.theta };
  }

  set(radius, phi, theta) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
    return this;
  }

  clone() {
    return this.copy(this);
  }

  copy(other) {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;
    return this;
  }

  makeSafe() {
    const EPS = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
    return this;
  }

  setFromCartesianCoords(x, y, z) {
    throw ('Error: No implemented in parent');
  }

  setFromVector3(v) {
    return this.setFromCartesianCoords(v.x, v.y, v.z);
  }
}


/* The polar angle (phi) is measured from the positive z-axis. The positive z-axis is up.
 * The azimuthal angle (theta) is measured from the positive x-axis.
 */
export class SphericalCoordsXYZ extends SphericalCoords {
  constructor(r = 0, phi = 0, theta = 0) {
    super(r, phi, theta);
  }

  static toCartesian(r, phi, theta) {
    const r_sinphi = r * Math.sin(phi);
    const x = Math.cos(theta) * r_sinphi;
    const y = Math.sin(theta) * r_sinphi;
    const z = r * Math.cos(phi);

    return { x, y, z };
  }

  get cartesian() {
    return SphericalCoordsXYZ.toCartesian(this.radius, this.phi, this.theta);
  }

  setFromCartesianCoords(x, y, z) {
    this.radius = Math.sqrt(x * x + y * y + z * z);
    this.theta = (x !== 0) ? Math.atan(y / x) : ((y > 0) ? Math.PI / 2 : -Math.PI / 2);
    this.phi = Math.acos(z / this.radius);

    return this.spherical;
  }
}


/* The polar angle (phi) is measured from the positive y-axis. The positive y-axis is up.
 * The azimuthal angle (theta) is measured from the positive z-axis.
 */
export class SphericalCoordsZXY extends SphericalCoords {
  constructor(r = 0, phi = 0, theta = 0) {
    super(r, phi, theta);
  }

  static toCartesian(r, phi, theta) {
    const r_sinphi = r * Math.sin(phi);
    const z = Math.cos(theta) * r_sinphi;
    const x = Math.sin(theta) * r_sinphi;
    const y = r * Math.cos(phi);

    return { x, y, z };
  }

  get cartesian() {
    return SphericalCoordsZXY.toCartesian(this.radius, this.phi, this.theta);
  }

  setFromCartesianCoords(x, y, z) {
    this.radius = Math.sqrt(z * z + x * x + y * y);
    this.theta = (z !== 0) ? Math.atan(x / z) : ((x > 0) ? Math.PI / 2 : -Math.PI / 2);
    this.phi = Math.acos(y / this.radius);

    return this.spherical;
  }
}

/* The polar angle (phi) is measured from the positive x-axis. The positive x-axis is up.
 * The azimuthal angle (theta) is measured from the positive y-axiz.
 */
export class SphericalCoordsYZX extends SphericalCoords {
  constructor(r = 0, phi = 0, theta = 0) {
    super(r, phi, theta);
  }

  static toCartesian(r, phi, theta) {
    const r_sinphi = r * Math.sin(phi);
    const y = Math.cos(theta) * r_sinphi;
    const z = Math.sin(theta) * r_sinphi;
    const x = r * Math.cos(phi);

    return { x, y, z };
  }

  get cartesian() {
    return SphericalCoordsYZX.toCartesian(this.radius, this.phi, this.theta);
  }

  setFromCartesianCoords(x, y, z) {
    this.radius = Math.sqrt(x * x + y * y + z * z);
    this.theta = (y !== 0) ? Math.atan(z / y) : ((z > 0) ? Math.PI / 2 : -Math.PI / 2);
    this.phi = Math.acos(x / this.radius);

    return this.spherical;
  }
}
