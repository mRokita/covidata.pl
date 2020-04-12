# base image
FROM node:12.2.0-alpine AS react-build
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./public ./public
COPY ./src ./src
RUN npm run build
RUN npm run snapshot

# Stage 2 - the production environment
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
