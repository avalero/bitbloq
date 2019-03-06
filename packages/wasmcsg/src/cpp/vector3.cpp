#include "vector3.h"
#include <iostream>

using namespace std;

Vector3::Vector3(double _x, double _y, double _z):
    x(_x),
    y(_y),
    z(_z)
{

}

Vector3 &  Vector3::setComponent(int index, double value){
    if(index < 0 || index >= 3){
        throw string("Index out of range");
    }

    switch(index){
    case 0: x = value; break;
    case 1: y = value; break;
    case 2: z = value; break;
    }
    return *this;
}

double Vector3::getComponent(int index) const {
    if(index < 0 || index >= 3){
        throw string("Index out of range");
    }

    switch(index){
    case 0: return x;
    case 1: return y;
    case 2: return z;
    }

    // unreachable line of code
    return 0;
}

Vector3 Vector3::clone() const{
    return Vector3(x,y,z);
}

Vector3 &Vector3::add(const Vector3 &vector)
{
    x += vector.x;
    y += vector.y;
    z += vector.z;
    return * this;
}

Vector3 &Vector3::sub(const Vector3 &vector)
{
    x -= vector.x;
    y -= vector.y;
    z -= vector.z;
    return * this;
}

Vector3 &Vector3::multiplyScalar(const double t)
{
    x *= t;
    y *= t;
    z *= t;
    return * this;
}
