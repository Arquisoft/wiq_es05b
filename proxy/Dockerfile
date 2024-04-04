FROM nginx:1.24.0

COPY default.conf /etc/nginx/conf.d/default.conf

COPY certificate.crt /etc/nginx/ssl/certificate.crt
COPY ca_bundle.crt /etc/nginx/ssl/ca_bundle.crt
COPY private.key /etc/nginx/ssl/private.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]