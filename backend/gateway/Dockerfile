FROM node

WORKDIR /app

# root package.json
COPY package*.json ./
RUN npm install

# gateway package.json
COPY ./gateway/package*.json ./gateway/
RUN cd gateway && npm install

#other all files
COPY gateway ./gateway
COPY shared ./shared

#main directory to run 
WORKDIR /app/gateway

EXPOSE 8000

CMD ["npm","start"]