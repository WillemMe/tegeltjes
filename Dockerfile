FROM node:latest
WORKDIR /tmp
# Install tools & libs to compile everything
RUN apt-get update && apt-get install -y build-essential libssl-dev libreadline-dev wget && apt-get clean

RUN wget https://www.imagemagick.org/download/ImageMagick-7.0.10-61.tar.gz
RUN tar xvzf ImageMagick-7.0.10-61.tar.gz && cd ./ImageMagick-7.0.10-61 && ./configure && make && make install && ldconfig /usr/local/lib
# Install imagemagick with support to native library
ENV PATH=$PATH:~/opt/bin:~/opt/node/bin

COPY fonts /home/node/.local/share/fonts

