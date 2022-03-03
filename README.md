<img align="left" width="100" height="100" src="branding/logo/picsur.svg"/>

# Picsur

<br>

> Totally not an imgur clone

I couldn't really find any open source project that allowed you to easily host images. So I decided to create one.

It works like a hybrid between imgur and pastebin.

## Beta

Right now this software is still in beta, and many things are still missing, or will be changed in the future.
But it does function, so feel free to give it a try.

## Demo

> ### Demo is temporarily offline, oracle just straight up turned my free account off, thx oracle
> A new host is being worked on

You can view a live demo here: <https://picsur.rubikscraft.nl/>

The images are deleted every five minutes, and the max filesize is 16MB. But it should give you an indication of how it works.

## Bugs

If you encounter any bugs or oddities, please open an issue [here](https://github.com/rubikscraft/Picsur/issues). Cause without feedback I'll never know they exists.

## Running

You easily run this service yourself via Docker. Here is an example docker-compose file:

```yaml
version: "3"
services:
  picsur:
    image: ghcr.io/rubikscraft/picsur:latest
    container_name: picsur
    ports:
      - "8080:8080"
    environment:
      # PICSUR_HOST: '0.0.0.0'
      # PICSUR_PORT: 8080

      PICSUR_DB_HOST: picsur_postgres
      # PICSUR_DB_PORT: 5432
      # PICSUR_DB_USER: picsur
      # PICSUR_DB_PASSWORD: picsur
      # PICSUR_DB_NAME: picsur

      # PICSUR_ADMIN_USERNAME: picsur
      # PICSUR_ADMIN_PASSWORD: picsur

      # PICSUR_JWT_SECRET: CHANGE_ME
      # PICSUR_JWT_EXPIRY: 1d

      # PICSUR_MAX_FILE_SIZE: 128000000
      # PICSUR_STATIC_FRONTEND_ROOT: "/picsur/frontend/dist"
    restart: unless-stopped
  picsur_postgres:
    image: postgres:11-alpine
    container_name: picsur_postgres
    environment:
      POSTGRES_DB: picsur
      POSTGRES_PASSWORD: picsur
      POSTGRES_USER: picsur
    restart: unless-stopped
    volumes:
      - picsur-data:/var/lib/postgresql/data
volumes:
  picsur-data:
```

## Api

Here is a usually up to date documentation of the api:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/rubikscraft/workspace/picsur/collection/1841871-78e559b6-4f39-4092-87c3-92fa29547d03)
