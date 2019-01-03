#
# Toolchain for cross-compiling to JS using Emscripten with WebAssembly
#
# Modify EMSCRIPTEN_PREFIX to your liking; use EMSCRIPTEN environment variable
# to point to it or pass it explicitly via -DEMSCRIPTEN_PREFIX=<path>.
#
#  mkdir build-emscripten-wasm && cd build-emscripten-wasm
#  cmake .. -DCMAKE_TOOLCHAIN_FILE=../toolchains/generic/Emscripten-wasm.cmake
#

cmake_minimum_required(VERSION 2.8)

project(wasmcsg)

set(HEADERS
  src/cpp/matrix4.h
  src/cpp/geometry.h
  src/cpp/node.h
  src/cpp/polygon.h
  src/cpp/vertex.h
  src/cpp/vector3.h
  src/cpp/vector2.h
  )

set(SOURCES
  src/cpp/matrix4.cpp
  src/cpp/geometry.cpp
  src/cpp/node.cpp
  src/cpp/polygon.cpp
  src/cpp/vertex.cpp
  src/cpp/vector3.cpp
  src/cpp/vector2.cpp
  src/cpp/csg.cpp)

add_executable(${PROJECT_NAME} ${SOURCES} ${HEADERS})
