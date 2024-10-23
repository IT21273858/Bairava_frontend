FROM node:20.12.1-alpine
WORKDIR /bairava
COPY . /bairava
RUN npm install
RUN npm run build
EXPOSE 8080
CMD npm run preview
