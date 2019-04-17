FROM node
COPY . .
RUN npm install
RUN npm run build --production
EXPOSE 5000
RUN npm install -g serve
CMD serve -s build