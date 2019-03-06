#include <iostream>
#include "vector2.h"

using namespace std;

Vector2::Vector2(double _x, double _y):
    x(_x),
    y(_y)
{

}

Vector2 &  Vector2::setComponent(int index, double value){
    if(index < 0 || index >= 2){
        throw string("Index out of range");
    }

    switch(index){
    case 0: x = value; break;
    case 1: y = value; break;
    }
    return *this;
}

double Vector2::getComponent(int index) const{
    if(index < 0 || index >= 2){
        throw string("Index out of range");
    }

    switch(index){
    case 0: return x;
    case 1: return y;
    }

    // unreachable line of code
    return 0;
}

Vector2 Vector2::clone() const {
    return Vector2(x,y);
}

Vector2 &Vector2::add(const Vector2 &vector)
{
    x += vector.x;
    y += vector.y;
    return * this;
}

Vector2 &Vector2::sub(const Vector2 &vector)
{
    x -= vector.x;
    y -= vector.y;
    return * this;
}


Vector2 &Vector2::multiplyScalar(const double t)
{
    x *= t;
    y *= t;
    return * this;
}

