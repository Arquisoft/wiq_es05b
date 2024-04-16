FROM kibana:8.13.0

# TODO - Move to compose
#ENV ELASTICSEARCH_USERNAME="elastic"
#ENV ELASTICSEARCH_PASSWORD="changeme"

COPY kibana.yml ./config/kibana.yml

EXPOSE 5601

CMD ["./bin/kibana", "-e", "http://elasticsearch:9200"]