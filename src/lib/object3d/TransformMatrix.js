/**
 * Transformation matrix for rotation and translation operations
 * 4x4 matrix
 */
export default class TransformMatrix {
  
  static rows = 4;
  static cols = 4;

  static rad2deg(radians){
    const pi = Math.PI;
    return radians * (180/pi);
  };

  static deg2rad(degrees){
    const pi = Math.PI;
    return degrees * (pi / 180);
  };
  
  /**
   * Creates identity matrix
   */
  constructor() {
    this.matrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  get(row, col) {
    if (row <= TransformMatrix.rows && col <= TransformMatrix.cols && row > 0 && col > 0) {
      return this.matrix[(row - 1) * TransformMatrix.cols + (col - 1)];
    }

    throw new Error('Matrix indexes out of bounds: ' + row + ', ' + col);
  }

  set(row, col, value){
    if (row <= TransformMatrix.rows  && col <= TransformMatrix.cols && row > 0 && col > 0)
        this.matrix[(row-1)*TransformMatrix.cols + (col-1)] = value;
    else
      throw new Error('Matrix indexes out of bounds: ' + row + ', ' + col);
}

  /**
   * Multiplies this matrix by parameter right
   * @param {TransformMatrix} right. Post multiply this matrix by right
   */
  multiply(right) {
    const result = new TransformMatrix();
    const a = this.matrix;
    const b = right.matrix;
    const r = result.matrix;

    r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

    r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

    r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

    r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

    this.matrix = result.matrix;
  }

  transform(tr){
    tr.multiply(this);
    this.matrix = tr.matrix;
  }

  relTransform(tr){
    this.multiply(tr);
  }

  /**
   * @param {angle: double, rel: bool} x Performs a rotation of x degrees around absolute/relative x axis (it transforms current matrix) 
   */
  rotateX(rot) {
    const x = TransformMatrix.deg2rad(rot.angle);

    const rotation = new TransformMatrix;
    //rotation.set(1,1,1);
    rotation.set(2,2,Math.cos(x));
    rotation.set(2,3,-Math.sin(x));
    rotation.set(3,2,Math.sin(x));
    rotation.set(3,3,Math.cos(x));

    if(rot.rel)
      this.relTransform(rotation);
    else
      this.transform(rotation);
  }

  /**
   * @param {angle: double, rel: bool} y Performs a rotation of y degrees around absolute/relative y axis (it transforms current matrix) 
   */
  rotateY(rot) {
    const y = TransformMatrix.deg2rad(rot.angle);

    const rotation = new TransformMatrix;
    rotation.set(1,1,Math.cos(y));
    rotation.set(1,3,Math.sin(y));
    rotation.set(3,1,-Math.sin(y));
    rotation.set(3,3,Math.cos(y));
  
    if(rot.rel)
      this.relTransform(rotation);
    else
      this.transform(rotation);
  }

  /**
   * @param {angle:double, rel: bool} z Performs a rotation of z degrees around absolute/relative z axis (it transforms current matrix) 
   */
  rotateZ(rot) {
    z = TransformMatrix.deg2rad(rot.angle);

    const rotation = new TransformMatrix;
    rotation.set(1,1,Math.cos(z));
    rotation.set(1,2,-Math.sin(z));
    rotation.set(2,1,Math.sin(z));
    rotation.set(2,2,Math.cos(z));

    if(rot.rel)
      this.relTransform(rotation);
    else
      this.transform(rotation);
  }

/**
 * 
 * @param {{x:doble, y:double, z:double, rel:bool}} tr Performas absolute/relative translation on x,y,z axes. 
 */
  translate(tr) {
    const translation = new TransformMatrix;
    translation.set(1,4,tr.x);
    translation.set(2,4,tr.y);
    translation.set(3,4,tr.z);

    if(tr.rel)
      this.relTransform(translation);
    else
      this.transform(translation);
  }


  /**
   * @returns absolute rotation angles around x, y, z axes (in rads).
   */
  get globalXYZAngles() {
    let x = Math.atan2( - this.get(3,2) , - this.get(3,3) );
    let y = Math.atan2( - this.get(3,1) , - Math.sqrt( this.get(3,2)* this.get(3,2)  + this.get(3,3) * this.get(3,3) ) );
    let z = Math.atan2( - this.get(2,1) , - this.get(1,1) );

    return {x, y, z};
  }

  /**
   * @returns absolute translation on x, y, z axes
   */
  get globalTranslation() {
    const x = this.get(1,4);
    const y = this.get(2,4);
    const z = this.get(3,4);

    return {x, y, z};

  }
/**
 * 
 * @param {Object3D Operation} operation 
 */
  makeOperation(operation){
    if(operation.type === 'translation'){
      this.translate({x: operation.x, y:operation.y, z:operation.z,rel:operation.relative});
    }else if(operation.type === 'rotation'){
      switch(operation.axis){
        case 'x':
          this.rotateX({angle:operation.angle, rel: operation.relative});
          break;
        case 'y':
          this.rotateY({angle:operation.angle, rel: operation.relative});
          break; 
        case 'z':
          this.rotateZ({angle:operation.angle, rel: operation.relative});
          break;     
      }
    }
  }
}
