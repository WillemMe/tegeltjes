FROM node:bullseye
WORKDIR /tmp
# Install tools & libs to compile everything
RUN apt-get update && apt-get install -y build-essential libssl-dev libreadline-dev wget freetype2-demos freetype2-doc libfreetype-dev && apt-get clean
# Install imagemagick with support to native library
RUN wget --no-check-certificate https://download.imagemagick.org/archive/ImageMagick-7.1.0-62.tar.gz
ENV LD_LIBRARY_PATH=/usr/local/lib
RUN tar xvzf ImageMagick-7.1.0-62.tar.gz && cd ./ImageMagick-7.1.0-62 && ./configure && make && make install && ldconfig /usr/local/lib

#Copy files over
ENV PATH=$PATH:~/opt/bin:~/opt/node/bin
COPY fonts /home/node/.local/share/fonts
WORKDIR /home/node/app
COPY ./package.json ./
RUN npm install
COPY ./app.js ./

#Public is mounted in compose
#MOUNT ./public ./
