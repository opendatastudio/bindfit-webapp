#!/bin/bash

ember deploy -e production
tag="bindfit-client:$(git rev-parse --short HEAD)"
ember deploy:activate --revision $tag -e production
