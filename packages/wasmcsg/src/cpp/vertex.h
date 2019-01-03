#ifndef VERTEX_H
#define VERTEX_H

#include "vector3.h"
#include "vector2.h"
#include "matrix4.h"

class Vertex
{
public:
    Vertex(double _x = 0, double _y = 0, double _z = 0,
           Vector3 _normal = Vector3(),
           Vector2 _uv = Vector2());

    // copy constructor
    Vertex(const Vertex & obj);

    Vertex clone() const;
    Vertex& add(const Vertex & vertex);
    Vertex& subtract(const Vertex & vertex);
    Vertex& multiplyScalar(const double scalar);
    Vertex& cross(const Vertex & vertex);
    double dot(const Vertex & vertex) const;
    Vertex & normalize();
    Vertex & lerp(const Vertex & a, const double t);
    Vertex & interpolate(const Vertex & other, const double t) const;
    Vertex & applyMatrix4(const Matrix4 & m);

    double x,y,z;
    Vector3 normal;
    Vector2 uv;

};

#endif // VERTEX_H
