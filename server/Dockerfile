FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
# Install dependencies
RUN npm install
COPY . /app
CMD ["npm", "start"]