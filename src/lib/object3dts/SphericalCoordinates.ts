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
 * Last modified  : 2018-11-14 08:46:30
 */

interface ISpherical {
  radius: number
  phi: number
  theta: number
}

interface ICartesian {
  x: number
  y: number
  z: number
}

class SphericalCoords {
  protected radius: number
  protected phi: number
  protected theta: number

  constructor(r: number = 0, phi: number = 0, theta: number = 0) {
    this.radius = r
    this.phi = phi
    this.theta = theta
  }

  public get sphericalGrads(): ISpherical {
    const rads: ISpherical = this.spherical
    return {
      radius: rads.radius,
      phi: (rads.phi * 180) / Math.PI,
      theta: (rads.theta * 180) / Math.PI,
    }
  }

  public get spherical(): ISpherical {
    return { radius: this.radius, phi: this.phi, theta: this.theta }
  }

  public set(radius: number, phi: number, theta: number): SphericalCoords {
    this.radius = radius
    this.phi = phi
    this.theta = theta
    return this
  }

  public clone(): SphericalCoords {
    return this.copy(this)
  }

  public copy(other: SphericalCoords): SphericalCoords {
    this.radius = other.radius
    this.phi = other.phi
    this.theta = other.theta
    return this
  }

  public makeSafe(): SphericalCoords {
    const EPS: number = 0.000001
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi))
    return this
  }

  public setFromCartesianCoords(
    x: number,
    y: number,
    z: number,
  ): SphericalCoords {
    throw Error('Error: No implemented in parent')
    return this
  }

  public setFromVector3(v: BABYLON.Vector3): SphericalCoords {
    return this.setFromCartesianCoords(v.x, v.y, v.z)
  }
}

/* The polar angle (phi) is measured from the positive z-axis. The positive z-axis is up.
 * The azimuthal angle (theta) is measured from the positive x-axis.
 */
export class SphericalCoordsXYZ extends SphericalCoords {
  constructor(r: number = 0, phi: number = 0, theta: number = 0) {
    super(r, phi, theta)
  }

  public static toCartesian(r: number, phi: number, theta: number): ICartesian {
    const r_sinphi: number = r * Math.sin(phi)
    const x: number = Math.cos(theta) * r_sinphi
    const y: number = Math.sin(theta) * r_sinphi
    const z: number = r * Math.cos(phi)

    return { x, y, z }
  }

  public get cartesian(): ICartesian {
    return SphericalCoordsXYZ.toCartesian(this.radius, this.phi, this.theta)
  }

  public setFromCartesianCoords(
    x: number,
    y: number,
    z: number,
  ): SphericalCoords {
    this.radius = Math.sqrt(x * x + y * y + z * z)
    this.theta = x !== 0 ? Math.atan(y / x) : y > 0 ? Math.PI / 2 : -Math.PI / 2
    this.phi = Math.acos(z / this.radius)

    return this
  }
}
