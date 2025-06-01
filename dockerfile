# Stage 1: Build React frontend
FROM node:18 AS frontend-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build

# Stage 2: Setup backend and serve frontend
FROM node:18

WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY index.js ./
COPY config ./config
COPY routes ./routes
COPY models ./models


RUN npm install --production

# Copy frontend
COPY client ./client
COPY --from=frontend-builder /app/client/build ./client/build

EXPOSE 8080

CMD ["node", "index.js"]




# Use official Node.js LTS image as base
# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8080
# CMD ["npm", "start"]