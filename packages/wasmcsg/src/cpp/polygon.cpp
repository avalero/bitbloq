#include "polygon.h"

const double Polygon::EPSILON = 1e-5;
const char Polygon::COPLANAR = 0;
const char Polygon::FRONT = 1;
const char Polygon::BACK = 2;
const char Polygon::SPANNING = 3;
Polygon::Polygon(const vector<Vertex> & _vertices):
    vertices{_vertices}
{
    if(vertices.size() > 0){
        calculateProperties();
    }

}

Polygon::Polygon(const Polygon &p):
    vertices{p.vertices},
    normal{p.normal},
    w{p.w}
{
}

Polygon::Polygon()
{}


Polygon & Polygon::calculateProperties(){
    const Vertex a = vertices.at(0);
    const Vertex b = vertices.at(1);
    const Vertex c = vertices.at(2);

    // (b-a) x (c-a)
    normal = b.clone().subtract(a).cross(c.clone().subtract(a)).normalize();
    w = normal.clone().dot(a);

    return *this;
}

Polygon Polygon::clone() const
{
    return Polygon{vertices};
}

Polygon &Polygon::flip()
{
    vector<Vertex> _vertices;
    normal.multiplyScalar(-1);
    w *= -1;

    for(long i = vertices.size() - 1; i >= 0; i--){
        _vertices.push_back(vertices.at(i));
    }

    return * this;
}

char Polygon::classifySide(const Polygon &polygon) const
{
    Vertex vertex;
    char classification;
    int num_positive{0};
    int num_negative{0};

    for(auto & vertex:polygon.vertices){
        classification = classifyVertex(vertex);
        if(classification == FRONT){
            num_positive++;
        }else if (classification == BACK){
            num_negative++;
        }
    }

    if (num_positive > 0 && num_negative == 0){
        return FRONT;
    }

    if (num_positive == 0 && num_negative > 0){
        return BACK;
    }

    if (num_positive == 0 && num_negative == 0) {
        return COPLANAR;
    } else {
        return SPANNING;
    }
}

void Polygon::splitPolygon(const Polygon &polygon, vector<Polygon> &coplanar_front, vector<Polygon> &coplanar_back, vector<Polygon> &front, vector<Polygon> &back)
{
    const char classification = classifySide(polygon);

    if(classification == COPLANAR){
        if(normal.dot(polygon.normal) > 0){
            coplanar_front.push_back(polygon);
        }else{
            coplanar_back.push_back(polygon);
        }
    }else if(classification == FRONT){
        front.push_back(polygon);
    }else if(classification == BACK){
        back.push_back(polygon);
    }else{
        unsigned long j{0};
        Vertex vi, vj, v;
        double t;
        char ti, tj;
        vector<Vertex> f,b;
        for(unsigned long i=0; i < polygon.vertices.size(); i++){
            j = (i+1) % polygon.vertices.size();
            vi = polygon.vertices.at(i);
            vj = polygon.vertices.at(j);
            ti = classifyVertex(vi);
            tj = classifyVertex(vj);

            if(ti != BACK){
                f.push_back(vi);
            }

            if(ti != FRONT){
                b.push_back(vi);
            }

            // CHECK IF THIS IS CORRECT IN C++
            if( (ti | tj) == SPANNING){
                t = (w - normal.dot(vi)) / normal.dot(vj.clone().subtract(vi));
                v = vi.interpolate(vj,t);
                f.push_back(v);
                b.push_back(v);
            }
        }

        if(f.size() >= 3){
            front.push_back(Polygon(f).calculateProperties());
        }

        if(b.size() >= 3){
            back.push_back(Polygon(b).calculateProperties());
        }
    }
}

char Polygon::classifyVertex(const Vertex &vertex) const
{
    const double side_value = normal.dot(vertex) - w;

    if (side_value < -EPSILON) {
        return BACK;
    }

    if (side_value > EPSILON) {
        return FRONT;
    }

    return COPLANAR;
}

