# Use an official Node.js image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema before running generate
COPY prisma/ prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the environment file
COPY .env.production .env.production

# Copy the rest of the app code
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/assets /app/assets
COPY --from=builder /app/.env.production /app/.env
COPY --from=builder /app/prisma/schema.prisma /app/prisma/schema.prisma

# Set environment variable to production
ENV NODE_ENV=production

# Start the Next.js server
CMD ["npm", "run", "start"]
