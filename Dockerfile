FROM node:14.17.5-alpine3.14

WORKDIR /app/dsi

COPY ./dsi/package.json .
COPY ./dsi/package-lock.json .
RUN npm install

CMD npm run devstart