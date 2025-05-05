FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
# Install dependencies
RUN npm install
COPY . /app
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
