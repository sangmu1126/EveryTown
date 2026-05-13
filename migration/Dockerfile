FROM python:3.9-slim

WORKDIR /app

RUN pip install mysql-connector-python elasticsearch==7.13.4

COPY migrate.py .

CMD ["python", "migrate.py"]
