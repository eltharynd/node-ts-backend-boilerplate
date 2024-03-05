FROM node:20.11.0

WORKDIR /usr/local/app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]