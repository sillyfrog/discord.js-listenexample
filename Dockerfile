FROM node:14

RUN mkdir /app
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
RUN npm init -y
RUN npm install git+https://github.com/discordjs/discord.js.git \
    @discordjs/opus \
    zlib-sync \
    discordapp/erlpack \
    libsodium-wrappers \
    utf-8-validate

RUN mkdir /app/recordings
COPY join.mp3 /app/
COPY demo.js /app/
COPY auth.json /app/
