#ifndef POLYGON_H
#define POLYGON_H

#include <vector>
#include "vertex.h"

using namespace std;

class Polygon
{
public:
    Polygon(const vector<Vertex> &_vertices);
    Polygon(const Polygon & p);
    Polygon();

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

    static const double EPSILON;
    static const char COPLANAR;
    static const char FRONT;
    static const char BACK;
    static const char SPANNING;
};


#endif // POLYGON_H
