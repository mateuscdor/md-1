FROM node:16.13.0

RUN apt-get update && \
  apt-get install -y \
  nodejs \
  python \
  python2 \
  ffmpeg \
  imagemagick \
  webp \
  chromium && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

RUN npm i -g npm@6.14.14
RUN npm install
RUN npm update

CMD ["npm", "run", "mongo"]
EXPOSE 6892
