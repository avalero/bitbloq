#include "vertex.h"
#include <math.h>
#include <array>
#include "matrix4.h"

using namespace std;

Vertex::Vertex(double _x, double _y, double _z, Vector3 _normal, Vector2 _uv):
    x(_x),
    y(_y),
    z(_z),
    normal(_normal),
    uv(_uv)
{

}

Vertex::Vertex(const Vertex &obj)
{
    x = obj.x;
    y = obj.y;
    z = obj.z;
    normal = obj.normal.clone();
    uv = obj.uv.clone();
}



Vertex Vertex::clone() const
{
    return Vertex(x,y,z,normal,uv);

}

Vertex & Vertex::add(const Vertex & vertex)
{
    x += vertex.x;
    y += vertex.y;
    z += vertex.z;
    return *this;
}

Vertex & Vertex::subtract(const Vertex & vertex)
{
    x -= vertex.x;
    y -= vertex.y;
    z -= vertex.z;
    return *this;
}

Vertex &Vertex::multiplyScalar(const double scalar)
{
    x *= scalar;
    y *= scalar;
    z *= scalar;
    return *this;
}

Vertex &Vertex::cross(const Vertex & vertex) {
    const double _x = x;
    const double _y = y;
    const double _z = z;

    x = _y * vertex.z - _z * vertex.y;
    y = _z * vertex.x - _x * vertex.z;
    z = _x * vertex.y - _y * vertex.x;

    return *this;
}

Vertex & Vertex::normalize() {
    const double length = sqrt(x*x + y*y + z*z);

    x /= length;
    y /= length;
    z /= length;

    return *this;
}

double Vertex::dot(const Vertex & vertex) const {
    return (x * vertex.x + y * vertex.y + z * vertex.z);
}

Vertex & Vertex::lerp(const Vertex & a, double t) {
    add(a.clone().subtract(*this).multiplyScalar(t));
    normal.add(a.normal.clone().sub(normal).multiplyScalar(t));
    uv.add(a.uv.clone().sub(uv).multiplyScalar(t));

    return *this;
}

Vertex & Vertex::interpolate(const Vertex & other, const double t) const {
    return clone().lerp(other, t);
}

Vertex & Vertex::applyMatrix4(const Matrix4 & m) {
    // input: THREE.Matrix4 affine matrix

    const double _x = x;
    const double _y = y;
    const double _z = z;

    array<double,16> e = m.elements;

    x = e[0] * _x + e[4] * _y + e[8] * _z + e[12];
    y = e[1] * _x + e[5] * _y + e[9] * _z + e[13];
    z = e[2] * _x + e[6] * _y + e[10] * _z + e[14];

    return *this;
}
