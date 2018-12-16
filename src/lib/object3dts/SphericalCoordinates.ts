/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-05 20:26:49
 * Last modified  : 2018-12-16 19:46:49
 */

interface ISpherical {
  radius: number;
  phi: number;
  theta: number;
}

export interface ICartesian {
  x: number;
  y: number;
  z: number;
}

export class SphericalCoords {
  public radius: number;
  public phi: number;
  public theta: number;

  constructor(r: number = 0, phi: number = 0, theta: number = 0) {
    this.radius = r;
    this.phi = phi;
    this.theta = theta;
  }

  public get sphericalGrads(): ISpherical {
    const rads: ISpherical = this.spherical;
    return {
      radius: rads.radius,
      phi: (rads.phi * 180) / Math.PI,
      theta: (rads.theta * 180) / Math.PI
    };
  }

  public get spherical(): ISpherical {
    return { radius: this.radius, phi: this.phi, theta: this.theta };
  }

  public set(radius: number, phi: number, theta: number): SphericalCoords {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
    return this;
  }

  public clone(): SphericalCoords {
    return this.copy(this);
  }

  public copy(other: SphericalCoords): SphericalCoords {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;
    return this;
  }

  public makeSafe(): SphericalCoords {
    const EPS: number = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
    return this;
  }

  public setFromCartesianCoords(
    x: number,
    y: number,
    z: number
  ): SphericalCoords {
    throw Error("Error: No implemented in parent");
    return this;
  }

  public get cartesian(): ICartesian {
    throw new Error("Implemented in child");
  }

  public setFromVector3(v: THREE.Vector3): SphericalCoords {
    return this.setFromCartesianCoords(v.x, v.y, v.z);
  }
}
