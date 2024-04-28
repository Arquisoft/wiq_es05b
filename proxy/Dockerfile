FROM nginx:1.24.0

RUN apt-get update && apt-get install -y gnupg2 apt-transport-https wget

RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
RUN apt-get install apt-transport-https
RUN echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-8.x.list
RUN apt-get update && apt-get install filebeat

COPY filebeat.yml /etc/filebeat/filebeat.yml

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY certificate.crt /etc/nginx/ssl/certificate.crt
COPY ca_bundle.crt /etc/nginx/ssl/ca_bundle.crt
COPY private.key /etc/nginx/ssl/private.key

EXPOSE 80
EXPOSE 443

CMD service filebeat start && nginx -g 'daemon off;'