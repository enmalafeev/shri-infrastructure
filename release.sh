#! /usr/bin/bash

current_tag=$(git tag | sort -r | head -1)
previos_tag=$(git tag | sort -r | head -2 | tail -1)
diff_between_last_tags=$(git log $(git describe --abbrev=0 --tags $(git describe --abbrev=0)^)...$(git describe --abbrev=0))
author_tag=$(git show ${current_tag} | grep Author: | head -1)
date_tag=$(git show ${current_tag} | grep Date: | head -1)
LOG=$(git log --pretty=format:"%h - %an, %cd : %s, %ce" --date=short ${previos_tag}..${current_tag})

summary="Release ${current_tag} from ${author_tag}"
description="${author_tag}\n${date_tag}\nVersion: ${current_tag}"
unique_tag="release ${current_tag}"
task_url="https://api.tracker.yandex.net/v2/issues/"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

createStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST ${task_url} \
    --header "${authHeader}" \
    --header "${orgHeader}" \
    --header "${contentType}" \
    --data-raw '{
        "queue": "TMP",
        "summary": "'"${summary}"'",
        "type": "task",
        "description": "'"${description}"'",
        "unique": "'"${unique_tag}"'"
    }'
)

echo "${summary}"
