export class SphericalCoordsXYZ {
  constructor(r = 0, phi = 0, theta = 0) {
    this.radius = r;
    this.phi = phi;
    this.theta = theta;
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

  makeSafe() {
    const EPS = 0.0001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
    return this;
  }

  setFromCartesian(x, y, z) {
    this.radius = Math.sqrt(x * x + y * y + z * z);
    this.theta = (x !== 0) ?  Math.atan(y / x) : ((y > 0) ? Math.PI/2 : -Math.PI/2);
    this.phi = Math.acos(z / this.radius);

    return this.spherical;
  }

  copy(other) {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;
    return this;
  }
}

export class SphericalCoordsZXY {

}

export class SphericalCoordsYZX {

}
