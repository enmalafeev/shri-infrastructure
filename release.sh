#!/bin/bash

CURRENT_TAG=$(git tag | sort -r | head -1)
PREVIOS_TAG=$(git tag | sort -r | head -2 | tail -1)
DIFF_BETWEEN_LAST_TAGS=$(git log $(git describe --abbrev=0 --tags $(git describe --abbrev=0)^)...$(git describe --abbrev=0))
CURRENT_TAG_AUTHOR=$(git show $currentTag  --pretty=format:"Author: %an" --date=format:'%Y-%m-%d %H:%M:%S' --no-patch)
CURRENT_TAG_DATE=$(git show ${CURRENT_TAG} | grep Date: | head -1)
LOG=$(git log $PREVIOS_TAG..$CURRENT_TAG)

summary="Release $CURRENT_TAG"
description="${CURRENT_TAG_AUTHOR} ${CURRENT_TAG_DATE} ${CURRENT_TAG}"
taskURL="https://api.tracker.yandex.net/v2/issues/"

curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST ${taskURL} \
--header "Authorization: ${OAuth}" \
--header "X-Org-Id: ${OrganizationId}" \
--header "Content-Type: application/json" \
--data-raw '{
    "queue": "TMP",
    "summary": "Testing name enmalafeev",
    "type": "task",
    "description": "some description"
}'

# echo "${OAuth}"
