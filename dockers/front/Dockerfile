FROM nginx:1.9
COPY dist /usr/share/nginx/html
COPY nginx-config.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD /bin/bash -c "nginx -g 'daemon off;'"