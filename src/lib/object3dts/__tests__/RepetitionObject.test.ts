import ObjectsGroups from '../ObjectsGroup'

import Cube from '../Cube'
import Object3D from '../Object3D'
import RepetitionObject from '../RepetitionObject'
import ObjectsGroup from '../ObjectsGroup'

const width = 7
const height = 5
const depth = 10

test('Check addition of objects to Group', () => {
  const object1: Cube = new Cube({ width, height, depth })
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 0, z: 0, num: 10 },
    object1,
  )

  return repetion.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toEqual(10)
  })
})

test('Check position of objects to Group', () => {
  const object1: Cube = new Cube({ width, height, depth })
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  )

  return repetion.getMeshAsync().then(meshGroup => {
    const position0 = meshGroup.children[0].position
    const position2 = meshGroup.children[2].position
    expect(position0).toEqual({ x: 0, y: 0, z: 0 })
    expect(position2).toEqual({ x: 20, y: 40, z: 60 })
  })
})

test('Test getGroup', () => {
  const object1: Cube = new Cube({ width, height, depth })
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  )
  const group: ObjectsGroup = repetion.getGroup()
  const objects: Array<Object3D> = group.unGroup()
  expect(objects.length).toBe(3)
  return objects[0].getMeshAsync().then(mesh => {
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 })
  })
})

test('Test getGroup', () => {
  const object1: Cube = new Cube({ width, height, depth })
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  )
  const group: ObjectsGroup = repetion.getGroup()
  const objects: Array<Object3D> = group.unGroup()
  expect(objects.length).toBe(3)
  return objects[2].getMeshAsync().then(mesh => {
    expect(mesh.position).toEqual({ x: 20, y: 40, z: 60 })
  })
})
