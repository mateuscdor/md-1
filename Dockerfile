FROM node:16.13.0

RUN apt-get update && \
  apt-get install -y \
  nodejs \
  python \
  python2 \
  ffmpeg \
  imagemagick \
  graphicsmagick \
  webp \
  chromium && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /bot
COPY . /bot

RUN npm install
RUN npm update

CMD ["npm", "run", "mongo"]
EXPOSE 6892
