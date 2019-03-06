#include <iostream>

#include "node.h"
#include "geometry.h"
#include "polygon.h"
#include "node.h"
#include "matrix4.h"
#include "vertex.h"

using namespace std;

const double ESPISLON = 1e-5;
const char coplanar = 0;
const char front = 1;
const char back = 2;
const char spanning = 3;



class ThreeBSP
{
private:
    Polygon polygon;
    Vertex vertex;
    Node node;
    Matrix4 matrix;
    Node tree;
};

int main(){
    cout << "Hello Wasm " << endl;
    return 0;
}
