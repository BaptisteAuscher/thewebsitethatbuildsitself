# ---- Build stage ----
FROM golang:1.26-alpine AS build

WORKDIR /app

# Install deps first for better layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source
COPY . .

# Build a static binary
# Adjust "./cmd/server" to wherever your main package lives (e.g. "." if main.go is at the root)
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server .

# ---- Production stage ----
FROM alpine:3.20 AS production

# Certs needed for outbound HTTPS calls (e.g. to other APIs)
RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=build /server /app/server

EXPOSE 8080

ENTRYPOINT ["/app/server"]
