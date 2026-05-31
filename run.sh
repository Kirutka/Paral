#!/bin/bash
# Запуск всех серверов в фоне
npm run sync &
SYNC_PID=$!
npm run api &
API_PID=$!
npm run dev &
DEV_PID=$!

# Ожидание Ctrl+C
trap "kill $SYNC_PID $API_PID $DEV_PID" EXIT
wait