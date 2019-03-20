#DEV

# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node
# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
# Copy all local files into the image.
COPY . .
# Build for production.
RUN npm install
RUN npm run build --production
# Tell Docker about the port we'll run on.
EXPOSE 5000
# Install `serve` to run the application.
RUN npm install -g serve
# Set the command to start the node server.
CMD serve -s build

#PROD

# # build environment
# FROM node as builder
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY package.json /usr/src/app/package.json
# RUN npm install --silent
# COPY . /usr/src/app
# RUN npm run build

# # nginx
# FROM nginx:1.13.9-alpine
# RUN rm -rf /etc/nginx/conf.d
# COPY conf /etc/nginx
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]