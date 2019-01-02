#include "matrix4.h"

Matrix4::Matrix4()
{
    for(int i=0; i<elements.size(); i++){
        elements.at(i) = 0;
    }
}

Matrix4::Matrix4(array<double,16> e):
    elements(e)
{

}
