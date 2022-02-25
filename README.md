# Imagur

> Totally not an imgur clone

I couldn't really find any open source project that allowed you to easily host images. So I decided to create one.

It works like a hybrid between imgur and pastebin.

## Beta

Right now this software is still in beta, and many things are still missing, or will be changed in the future.
But it does function, so feel free to give it a try.

## Running

To start Imagur easily, you can clone the repository and then run `docker-compose up -d`. It will then be running on port `8080`.

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
