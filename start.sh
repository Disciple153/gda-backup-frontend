#!/bin/bash

# Start the API server
node --import tsx /app/server.ts &

# Start nginx
nginx -g "daemon off;" &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?