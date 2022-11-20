FROM --platform=linux/arm64 node:16-alpine

RUN apk update && apk add ca-certificates && update-ca-certificates

RUN mkdir /app
ADD . /app
WORKDIR /app
COPY package.json ./

ENV DB_USERNAME=root
ENV DB_PASSWORD=ngapainsih
ENV DB_NAME=db_titipitci
ENV DB_HOSTNAME=mysql
ENV DB_DIALECT=mysql
ENV PORT=5000

EXPOSE 5000

RUN npm i
CMD ["node", "index.mjs"]