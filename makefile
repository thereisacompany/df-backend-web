PROJECT_ID=ecstatic-maxim-374505
REGION=asia-southeast1
CLUSTER=tools-cluster
ARTIFACT_REGISTRY=asia-southeast1-docker.pkg.dev/ecstatic-maxim-374505/hf888/
NAME=livechat_backend
TAG=latest

.PHONY: init build push rollout clean
all: init build push rollout clean

init:
	npm install

build:
	npm run build
	docker buildx build --platform linux/amd64 -t $(ARTIFACT_REGISTRY)$(NAME):$(TAG) .

push:
	docker push $(ARTIFACT_REGISTRY)$(NAME):$(TAG)

rollout:
	gcloud container clusters get-credentials $(CLUSTER) --region $(REGION) --project $(PROJECT_ID)
	kubectl rollout restart deploy $(NAME) --namespace=default

clean:
	rm -rf ./dist
	rm -rf node_modules
	docker rmi $$(docker images '$(ARTIFACT_REGISTRY)$(NAME):$(TAG)' -a -q)