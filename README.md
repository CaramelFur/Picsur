<img align="left" width="100" height="100" src="branding/logo/picsur.svg"/>

<a  href="https://discord.gg/GPZNwV3VKE">
<img align="right" style="margin: 5px" src="https://img.shields.io/discord/986634827337965638?color=454FBF&label=Chat%20on%20Discord"/>
</a>

# Picsur

<br>

> Totally not an imgur clone

I couldn't really find any open source project that allowed you to easily host images. So I decided to create one.

It feels like a hybrid between Imgur and Pastebin.

## Beta

Right now this software is still in beta, and many things are still missing, or will be changed in the future.
But it does function, so feel free to give it a try.

## Demo

You can view a live demo here: <https://picsur.rubikscraft.nl/>

The images are deleted every five minutes, and the maximum filesize is 16MB. But it should give you an indication of how it works.

## Features

Here is a list of done features, and what is planned.
For a more detailed list, you can always visit [the project](https://github.com/rubikscraft/Picsur/projects/1).

Right now, not every done feature here is available in the current release. But these will all be available with the next one.

- [x] Uploading and viewing images
- [x] Anonymous uploads
- [x] User accounts
- [x] User roles and permissions
- [x] Proper CORS restrictions
- [x] Exif stripping
- [x] Ability to keep original
- [x] Support for [QOI format](https://qoiformat.org/)
- [x] Convert images
- [x] Resize images
- [x] Apply filters
- [x] Deletable images

- [ ] Correct previews on chats
- [ ] Expiring images
- [ ] White mode
- [ ] ShareX endpoint
- [ ] Arm64 image

## Bugs

If you encounter any bugs or oddities, please open an issue [here](https://github.com/rubikscraft/Picsur/issues). Cause without feedback I'll never know they exists.

## Star

If you like this project, don't forget to give it a star. It tells me that I'm not wasting my time on something that people don't like.

## Running

You easily run this service yourself via Docker. Here is an example docker-compose file:

```yaml
version: '3'
services:
  picsur:
    image: ghcr.io/rubikscraft/picsur:latest
    container_name: picsur
    ports:
      - '8080:8080'
    environment:
      # PICSUR_HOST: '0.0.0.0'
      # PICSUR_PORT: 8080

      PICSUR_DB_HOST: picsur_postgres
      # PICSUR_DB_PORT: 5432
      # PICSUR_DB_USERNAME: picsur
      # PICSUR_DB_PASSWORD: picsur
      # PICSUR_DB_DATABASE: picsur

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

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/rubikscraft-team/workspace/picsur/collection/1841871-78e559b6-4f39-4092-87c3-92fa29547d03)
