FROM node:14-bullseye-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN HUSKY=0 npm ci

COPY . .

ARG REACT_APP_API_URL=/api
ARG REACT_APP_TEMP_IMAGE=
ARG REACT_APP_ERROR=

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_TEMP_IMAGE=$REACT_APP_TEMP_IMAGE
ENV REACT_APP_ERROR=$REACT_APP_ERROR

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
