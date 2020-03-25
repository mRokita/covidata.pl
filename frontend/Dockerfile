# base image
FROM node:12.2.0-alpine AS react-build
WORKDIR /app

COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/public ./public
COPY ./frontend/src ./src
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
