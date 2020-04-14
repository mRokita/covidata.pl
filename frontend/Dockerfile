# base image
FROM zenika/alpine-chrome:77-with-node-10 AS react-build
USER root
RUN mkdir /app
WORKDIR /app

# Installs the latest Chromium (64) package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY ./package.json ./

RUN yarn install
COPY ./public ./public
COPY ./src ./src
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
RUN apk add --no-cache curl
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
