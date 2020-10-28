
FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

##ENV NODE_ENV production
ENV NODE_ENV $NODE_ENV
ENV DEBUG $DEBUG

# Copy app dependencies
COPY package*.json package-lock.json ./


RUN chmod 2777 "/usr/src/app"

# Install app dependencies
RUN npm install --pure-lockfile

COPY . .

# Generate build files
#RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
