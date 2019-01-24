# Bitbloq Space Frontend

## Despliegue

Clonar el repositorio público de bitbloq https://github.com/bitbloq/bitbloq en la misma carpeta que `bitbloq-space`. Ir a la carpeta de `bitbloq` (público) y hacer

    npm install
    npx lerna bootstrap

Ir a la carpeta `bitbloq-space/frontend` y hacer

    npm install
    npm link ../../bitbloq/packages/ui
    npm link ../../bitbloq/packages/lib3d
    npm link ../../bitbloq/packages/3d
    npm run build

Se generará la carpeta `public` donde está el html que hay que servir como raíz en el nginx. Finalmente hacer proxy de todo lo que vaya a `http://bitbloq.cc/api` al servicio de API. Por ejemplo, esta es la configuración de nginx suponiendo que el api está en el host/contenedor llamado `api` en el puerto 4000

    location /api {
      proxy_pass            http://api:4000;
      proxy_redirect        off;
      proxy_set_header      Host $host;
      proxy_set_header      X-Real-IP $remote_addr;
      proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header      X-Forwarded-Host $server_name;

      rewrite ^/api/?(.*) /$1 break;
    }


