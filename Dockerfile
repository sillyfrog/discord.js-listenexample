FROM node:11

RUN mkdir /app
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
RUN npm init -y
RUN npm install git+https://github.com/discordjs/discord.js.git \
    @discordjs/uws bufferutil erlpack@discordapp/erlpack \
    libsodium-wrappers zlib-sync node-opus ffmpeg-static \
    amqplib
RUN mkdir /app/recordings
COPY join.mp3 /app/
COPY demo.js /app/
COPY auth.json /app/
