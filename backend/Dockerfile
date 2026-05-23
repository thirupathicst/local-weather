
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm clean-install
COPY . .
RUN npm run build
RUN npm prune --production


FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000
user node
CMD ["node", "dist/server.js"]