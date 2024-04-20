FROM elasticsearch:8.13.0

COPY start.sh .
COPY lib.sh .
COPY roles/* ./roles/

ENTRYPOINT ["./start.sh"]