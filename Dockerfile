FROM node:16.4.2

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm i -g @nestjs/cli

COPY . /app/

EXPOSE 8000

CMD ["bash", "start.sh"]