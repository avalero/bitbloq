# Bitbloq

Bitbloq is an educational platform designed to teach people robotics and 3D design.

## Packages

This is a monorepo containing several packages that you can find inside the `packages` folder:

    * `bitbloq-3d`. Web application to design 3D objects.
    * `bitbloq-ui`. Library of React UI components used in the platform

## Bootstrap

We are using [Lerna](https://lernajs.io/) to manage dependencies between Bitbloq packages. To setup all the packages dependencies run:

    npm install
    npx lerna bootstrap


