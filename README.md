<img align="left" width="100" height="100" src="branding/logo/imagur.svg"/>

# Imagur

<br>

> Totally not an imgur clone

I couldn't really find any open source project that allowed you to easily host images. So I decided to create one.

It works like a hybrid between imgur and pastebin.

## Beta

Right now this software is still in beta, and many things are still missing, or will be changed in the future.
But it does function, so feel free to give it a try.

## Demo

You can view a live demo here: <https://imagur-demo.rubikscraft.nl/>

The images are deleted every five minutes, and the max filesize is 16MB. But it should give you an indication of how it works.

## Bugs

If you encounter any bugs or oddities, please open an issue [here](https://github.com/rubikscraft/Imagur/issues). Cause without feedback I'll never know they exists.

## Running

You easily run this service yourself via Docker. Here is an example docker-compose file:

```yaml
version: "3"
services:
  imagur:
    image: ghcr.io/rubikscraft/imagur:latest
    container_name: imagur
    ports:
      - "8080:8080"
    environment:
      # IMAGUR_HOST: '0.0.0.0'
      # IMAGUR_PORT: 8080

      IMAGUR_DB_HOST: imagur_postgres
      # IMAGUR_DB_PORT: 5432
      # IMAGUR_DB_USER: imagur
      # IMAGUR_DB_PASSWORD: imagur
      # IMAGUR_DB_NAME: imagur

      # IMAGUR_ADMIN_USERNAME: imagur
      # IMAGUR_ADMIN_PASSWORD: imagur

      # IMAGUR_JWT_SECRET: CHANGE_ME
      # IMAGUR_JWT_EXPIRY: 1d

      # IMAGUR_MAX_FILE_SIZE: 128000000
      # IMAGUR_STATIC_FRONTEND_ROOT: "/imagur/frontend/dist"
    restart: unless-stopped
  imagur_postgres:
    image: postgres:11-alpine
    container_name: imagur_postgres
    environment:
      POSTGRES_DB: imagur
      POSTGRES_PASSWORD: imagur
      POSTGRES_USER: imagur
    restart: unless-stopped
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```

## Configuration

You can configure a couple different things using environment variables. Here is the current list with their default values:

```txt
IMAGUR_HOST: '0.0.0.0'
IMAGUR_PORT: 8080

IMAGUR_DB_HOST: imagur_postgres
IMAGUR_DB_PORT: 5432
IMAGUR_DB_USER: imagur
IMAGUR_DB_PASSWORD: imagur
IMAGUR_DB_NAME: imagur

IMAGUR_ADMIN_USERNAME: imagur
IMAGUR_ADMIN_PASSWORD: imagur

IMAGUR_JWT_SECRET: CHANGE_ME
IMAGUR_JWT_EXPIRY: 1d

IMAGUR_MAX_FILE_SIZE: 128000000
IMAGUR_STATIC_FRONTEND_ROOT: "/imagur/frontend/dist"
```

## Api

Here is a usually up to date documentation of the api:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/rubikscraft/workspace/imagur/collection/1841871-78e559b6-4f39-4092-87c3-92fa29547d03)
