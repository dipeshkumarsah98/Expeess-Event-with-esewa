FROM node:18-alpine As builder

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

# Bundle app source
COPY . .

RUN npx prisma generate

CMD ["npm", "run", "deploy"]

EXPOSE 8080
