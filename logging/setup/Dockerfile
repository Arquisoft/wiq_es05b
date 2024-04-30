FROM elasticsearch:8.13.0

COPY start.sh .
COPY lib.sh .
COPY roles/* ./roles/

RUN chmod +x start.sh

ENTRYPOINT ["./start.sh"]