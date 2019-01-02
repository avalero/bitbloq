#ifndef POLYGON_H
#define POLYGON_H

#include <vector>
#include "vertex.h"

using namespace std;

class Polygon
{
public:
    Polygon(const vector<Vertex> &_vertices);
    Polygon(){}
    Polygon &calculateProperties();
    Polygon clone() const;
    Polygon & flip();
    char classifyVertex(const Vertex & vertex) const;
    char classifySide(const Polygon & polygon) const;
    void splitPolygon(const Polygon & polygon,
                      vector<Polygon> & coplanar_front ,
                      vector<Polygon> & coplanar_back,
                      vector<Polygon> & front,
                      vector<Polygon> & back);

    vector<Vertex> vertices;
    Vertex normal;
    double w;

    const double EPSILON{1e-5};
    const char COPLANAR{0};
    const char FRONT{1};
    const char BACK{2};
    const char SPANNING{3};
};


#endif // POLYGON_H
