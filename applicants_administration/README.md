Before running, create .env file in the root of project and set REACT_APP_APPLICATIONS_API_URL=url of applications_server. <br/>
To run type in your console:
```
npm install
npm start
```
By default, the web-page will be available at localhost:3000.
<br/>
To create a docker image:
```
docker image build -t admin_panel:v1 .
```

To run this docker image:
```
docker run -dit -p 3030:80 --name admin_panel_container admin_panel:v1
```