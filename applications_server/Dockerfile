FROM python:3.11-slim
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install --no-cache-dir --upgrade -r /app/requirements.txt
COPY . /app
EXPOSE 8000
CMD ["python", "main.py"]