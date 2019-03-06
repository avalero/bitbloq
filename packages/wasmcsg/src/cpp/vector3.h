#ifndef VECTOR3_H
#define VECTOR3_H



class Vector3
{
public:
    Vector3(double _x = 0, double _y = 0, double _z = 0);

    void setX(double _x){ x = _x; }
    void setY(double _y){ y = _y; }
    void setZ(double _z){ z = _z; }

    Vector3 & setComponent(int index, double value);
    double getComponent(int index) const;
    Vector3 clone() const;
    Vector3 & add(const Vector3 & vector);
    Vector3 & sub(const Vector3 & vector);
    Vector3 & multiplyScalar(const double t);



    double x,y,z;
};

#endif // VECTOR3_H
