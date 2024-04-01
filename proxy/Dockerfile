FROM nginx:1.24.0

COPY default.conf /etc/nginx/conf.d/default.conf

COPY certificate.crt /etc/nginx/ssl/certificate.crt
COPY private.key /etc/nginx/ssl/private.key

EXPOSE 80
EXPOSE 443
EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]