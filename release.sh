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
get_task_url="https://api.tracker.yandex.net/v2/issues/_search"
updateTaskUrl="https://api.tracker.yandex.net/v2/issues/"

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

sleep 1

taskKey=$(curl --silent --location --request POST ${get_task_url} \
    --header "${authHeader}" \
    --header "${orgHeader}" \
    --header "${contentType}" \
    --data-raw '{
        "filter": {
            "unique": "'"${unique_tag}"'"
        }
    }' | jq -r '.[0].key'
)

if [ "$createStatusCode" -eq 409 ]
then
    echo "Cannot create ticket with the same release version"

    updateStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request PATCH \
        "${updateTaskUrl}${taskKey}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-raw '{
            "summary": "'"${summary}"'",
            "description": "'"${description}"' (updated)"
        }'
    )

    if [ "$updateStatusCode" -ne 200 ]
    then
        echo "Error with updating ticket ${taskKey}"
        exit 1
    else
        echo "Successfully updated ticket ${taskKey}"
    fi

elif [ "$createStatusCode" -ne 201 ]
then
    echo "Error with creating release ticket"
    exit 1
else
    echo "Successfully created ticket"
fi

echo "{\"text\": \"$(echo $gitlog | tr -d ':' | tr '\r\n' ' ')\"}" | jq > tmp.json

createCommentUrl="https://api.tracker.yandex.net/v2/issues/${taskKey}/comments"

createCommentStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST \
        "${createCommentUrl}" \
        --header "${authHeader}" \
        --header "${orgHeader}" \
        --header "${contentType}" \
        --data-binary @tmp.json
)

if [ "$createCommentStatusCode" -ne 201 ]
then
    echo "Error with creating comment with gitlog for issue ${taskKey}"
    exit 1
else
    echo "Successfully created comment with gitlog for issue ${taskKey}"
fi

rm tmp.json