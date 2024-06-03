Before running, create .env file in the root of project and set PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT,
DB_POSTGRES_URL=postgresql+psycopg2://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}, DB_MONGO_URL=mongodb://localhost:27017/,
MONGO_COLLECTION_NAME=application_schemas
<br/>
Python 3.11 is recommended. To run type in your console:
```
pip install -r "requirements.txt"
py main.py
```
or use venv.
<br />
To create a docker image:
```
docker image build -t applications_server:v1 .
```

To run this docker image:
```
docker run -dit -p 8000:80 --name applications_server_container applications_server:v1
```
By default, the server will be available at localhost:8000.