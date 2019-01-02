#ifndef VECTOR2_H
#define VECTOR2_H


class Vector2
{
public:
    Vector2(double _x = 0, double _y = 0);

    void setX(double _x){ x = _x; }
    void setY(double _y){ y = _y; }
    Vector2 & setComponent(int index, double value);
    double getComponent(int index) const;
    Vector2 clone() const;
    Vector2 & add(const Vector2 & vector);
    Vector2 & sub(const Vector2 & vector);

    Vector2 & multiplyScalar(const double t);


    double x,y;
};

#endif // VECTOR2_H
