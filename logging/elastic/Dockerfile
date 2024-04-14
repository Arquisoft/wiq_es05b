FROM elasticsearch:8.13.0

COPY elasticsearch.yml ./config/elasticsearch.yml

COPY start.sh .
COPY lib.sh .
COPY roles/* ./roles/

EXPOSE 9200
EXPOSE 9300

CMD ["./start.sh"]