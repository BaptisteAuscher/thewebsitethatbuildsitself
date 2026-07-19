# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first for better layer caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the source and build
COPY . .
RUN yarn build

# ---- Production stage ----
FROM nginx:1.27-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
# Adjust "dist" to "build" if you're using Create React App instead of Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config (handles client-side routing for React Router, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
