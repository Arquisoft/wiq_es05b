FROM elasticsearch:8.13.0

COPY start.sh .
COPY lib.sh .
COPY roles/* ./roles/

USER root
RUN chmod +x ./start.sh
USER 1000

ENTRYPOINT ["./start.sh"]