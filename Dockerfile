FROM gcr.io/percy_dev/baseimage-web:2017-12-10-181906

# Configure nginx.
ADD config/nginx-main.conf /etc/nginx/nginx.conf
ADD config/nginx-default-site.conf /etc/nginx/sites-enabled/default

# Configure nginx to run automatically.
ADD config/run-nginx.sh /etc/service/nginx/run
RUN chmod +x /etc/service/*/run

# Global npm packages.
RUN yarn global add bower

# Global test/development packages.
# TODO: if these get much bigger, split out to separate Dockerfile so we don't bloat the prod image.
RUN yarn global add phantomjs-prebuilt

# Setup the app directory and build the ember app.
ADD package.json yarn.lock bower.json /app/src/
WORKDIR /app/src/
RUN yarn
RUN bower install --allow-root
# Setup the full app directory (do this after package install to speed up docker builds).
ADD . /app/src/

ARG EMBER_TEST_BUILD="false"
RUN if [ "$EMBER_TEST_BUILD" = "true" ] ; then \
  yarn run build; \
else \
  yarn run build-production; \
fi


