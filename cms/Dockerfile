FROM node:22-slim

WORKDIR /opt/app

# Install native compilation dependencies for sqlite / sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=1337

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
