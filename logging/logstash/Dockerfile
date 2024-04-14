FROM logstash:8.13.0

COPY logstash.conf ./pipeline/logstash.conf
COPY logstash.yml ./config/logstash.yml

EXPOSE 5044

ENTRYPOINT ["./bin/logstash"]