# Makefile for building and running the FastAPI app in Docker

# Variables
APP_NAME := loan-app
PORT1 := 19000
PORT2 := 19001
PORT3 := 19002

# Targets
build:
	docker build -t $(APP_NAME) .

run:
	docker run -p $(PORT1):$(PORT1) -p $(PORT2):$(PORT2) -p $(PORT3):$(PORT3) -e EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 --name $(APP_NAME) -v $(PWD):/app $(APP_NAME)

stop:
	docker stop $(APP_NAME)
	docker rm $(APP_NAME)

serve:
	docker compose -p local -f docker-compose.yml --env-file local.env up --build

dev:
	npm run start

dev-ios:
	npm run ios

dev-android:
	npm run android
