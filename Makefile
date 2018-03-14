_pull_parent_image:
	gcloud docker -- pull $$(grep '^FROM' Dockerfile | grep -o ' .*' | tr -d ' ')

build: _pull_parent_image
	docker-compose build

test: _pull_parent_image
	docker-compose build --build-arg EMBER_TEST_BUILD=true web
	docker-compose run web yarn test:parallel

publish:
	@utils/publish
