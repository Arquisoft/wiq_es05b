FROM logstash:8.13.0

COPY beats.conf .

EXPOSE 5044

ENTRYPOINT ["./bin/logstash", "-f", "beats.conf"]