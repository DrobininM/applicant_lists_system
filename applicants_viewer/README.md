Before runnig, create .env file in the root of project and set PORT variable.
To run type in your console:
```
npm install
npm start
```

To create a docker image:
```
docker image build -t applications_viewer:v1 .
```

To run this docker image:
```
docker run -dit -p 3000:80 --name applications_viewer applications_viewer:v1
```
By default, the web-page will be available at localhost:3000.