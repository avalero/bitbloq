#ifndef MATRIX4_H
#define MATRIX4_H
#include <array>

using namespace std;

class Matrix4
{
  public:
    Matrix4();
    Matrix4(array<double,16> e);

    array<double, 16> elements;
};

#endif // MATRIX4_H
