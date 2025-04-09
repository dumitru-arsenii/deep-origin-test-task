#!/bin/sh
mkdir -p /run/postgresql
chown postgres:postgres /run/postgresql
chmod 775 /run/postgresql
su - postgres -c "pg_ctl start -D /var/lib/postgresql/data"

# Wait for PostgreSQL to be ready
until su - postgres -c "pg_isready -q"; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 1
done

psql -U postgres -c "CREATE USER myuser WITH SUPERUSER;"
psql -U postgres -c "CREATE DATABASE mydb OWNER myuser;"

pm2 start ecosystem.config.js &

nginx -g "daemon off;"