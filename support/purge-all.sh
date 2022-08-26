#!/bin/bash

yarn workspace shared purge
yarn workspace backend purge
yarn workspace frontend purge

yarn devdb:purge
yarn purge
