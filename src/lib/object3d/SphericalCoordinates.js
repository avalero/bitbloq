export class SphericalCoordsXYZ {
  constructor(r = 0, phi = 0, theta = 0) {
    this.r = r;
    this.phi = phi;
    this.theta = theta;
  }

  static toCartesian(r, phi, theta) {
    const r_sinphi = r * Math.sin(phi);
    const x = Math.cons(theta) * r_sinphi;
    const y = Math.sin(theta) * r_sinphi;
    const z = r * Math.cos(phi);

    return { x, y, z };
  }

  get cartesian() {
    return SphericalCoordsXYZ.toCartesian(this.r, this.phi, this.theta);
  }

  get spherical() {
    return { r: this.r, phi: this.phi, theta: this.theta };
  }

  fromCartesian(x, y, z) {
    this.r = Math.sqrt(x * x + y * y + z * z);
    this.theta = Math.atan(y / x);
    this.phi = Math.acos(z / this.r);

    return this.spherical;
  }
}

export class CartesianZXY {

}
