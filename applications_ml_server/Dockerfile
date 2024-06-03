#FROM python:3.11-slim
FROM python:3.7.3-stretch
WORKDIR /app
COPY . /app
# RUN apt-get update \
#     #&& apt-get install -y \
#         #cmake libsm6 libxext6 libxrender-dev protobuf-compiler \
#     #&& rm -r /var/lib/apt/lists/* \
#     && pip update \
#     && pip install -r requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 80
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]