# Use an official Node.js image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --include=dev

# Copy Prisma schema before running generate
COPY prisma/ prisma/

# Generate Prisma client
RUN npx prisma generate

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
COPY --from=builder /app/prisma /app/prisma

# Start the Next.js server
CMD ["npm", "run", "start"]
