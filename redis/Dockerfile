# REDIS Dockerfile

FROM redis
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
# Expose ports.
EXPOSE 6379

