export function dockerRedisServiceTemplate(port = 12000) {
  return (
`  redis:
    container_name: redis
    image: redis:8
    restart: always
    ports:
      - ${port}:6379
    volumes:
      - \${PWD}/redis:/data`
  );
}
