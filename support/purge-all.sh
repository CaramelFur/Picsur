#!/bin/bash

yarn workspace picsur-shared purge
yarn workspace picsur-backend purge
yarn workspace picsur-frontend purge

yarn devdb:remove
yarn purge
