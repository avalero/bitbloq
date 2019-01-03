#include "node.h"

Node::Node(vector<Polygon> _polygons):
    front{nullptr},
    back{nullptr},
    divider{nullptr}
{
    vector<Polygon> _front;
    vector<Polygon> _back;

    if (_polygons.size() == 0) return;

    divider = new Polygon(_polygons.at(0).clone());

    for(auto & polygon: _polygons){
        divider->splitPolygon(polygon, polygons, polygons, _front, _back);
    }

    if(_front.size() > 0){
        front = new Node(_front);
    }
    if(_back.size() > 0){
        back = new Node(_back);
    }
}

Node::Node():
    front{nullptr},
    back{nullptr},
    divider{nullptr}
{
    front = new Node();
    back = new Node();
}

bool Node::isConvex(vector<Polygon> _polygons) const
{
    for(unsigned long i = 0; i < _polygons.size(); i++){
        for(unsigned long j = 0; j < _polygons.size(); j++){
            if(i != j && _polygons.at(i).classifySide(polygons.at(j)) != Polygon::BACK ){
                return false;
            }
        }
    }
    return true;
}

void Node::build(vector<Polygon> _polygons)
{
    vector<Polygon> _front;
    vector<Polygon> _back;

    if(!divider){
        divider = new Polygon(_polygons.at(0).clone());
    }

    for(auto & polygon: _polygons){
        divider->splitPolygon(polygon, polygons, polygons, _front, _back);
    }

    if(_front.size() > 0){
        if(!front){
            front = new Node();
        }
        front->build(_front);
    }

    if(_back.size() > 0){
        if(!back){
            back = new Node();
        }
        back->build(_front);
    }
}

vector<Polygon> Node::allPolygons() const
{
    vector<Polygon> _polygons = polygons;
    if(front){
        vector<Polygon> allFront = front->allPolygons();
        _polygons.insert(_polygons.end(), allFront.begin(), allFront.end());
    }

    if(back){
        vector<Polygon> allBack = back->allPolygons();
        _polygons.insert(_polygons.end(), allBack.begin(), allBack.end());
    }

    return _polygons;
}

Node Node::clone() const {
    Node node;
    node.divider = new Polygon(divider->clone());
    node.polygons = polygons;
    if(front) node.front = new Node(front->clone());
    else node.front = nullptr;

    if(back) node.back = new Node(back->clone());
    else node.back = nullptr;

    return node;
}

Node &Node::invert()
{
    for(auto &polygon: polygons){
        polygon.flip();
    }

    divider->flip();

    if(front){
        front->invert();
    }

    if(back){
        back->invert();
    }

    Node* temp = front;
    front = back;
    back = temp;

    return *this;
}

vector<Polygon> Node::clipPolygons(const vector<Polygon> &_polygons) const
{
    if(!divider){
        return _polygons;
    }

    vector<Polygon> _front;
    vector<Polygon> _back;

    for(auto & polygon: _polygons){
        divider->splitPolygon(polygon, _front, _back, _front, _back);
    }

    if(front){
        _front = front->clipPolygons(_front);
    }

    if(back){
        _back = back->clipPolygons(_back);
    }

    _front.insert(_front.end(), _back.begin(), _back.end());

    return _front;
}

void Node::clipTo(const Node &_node)
{
    polygons = _node.clipPolygons(polygons);
    if(front){
        front->clipTo(_node);
    }
    if(back){
        back->clipTo(_node);
    }
}
