#ifndef NODE_H
#define NODE_H

#include <vector>
#include "polygon.h"

using namespace std;

class Node
{
public:
    Node(vector<Polygon> _polygons);
    Node();
    ~Node(){
        if (front) delete front;
        if (back) delete back;
        if (divider) delete divider;
    }

    bool isConvex(vector<Polygon> _polygons) const;
    void build(vector<Polygon> _polygons);
    vector<Polygon> allPolygons() const;
    Node clone() const;
    Node & invert();
    vector<Polygon> clipPolygons(const vector<Polygon> & _polygons) const;
    void clipTo(const Node & _node);

private:
    vector<Polygon> polygons;
    Node* front;
    Node* back;
    Polygon* divider;

};

#endif
