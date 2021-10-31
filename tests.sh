#! /usr/bin/bash

current_tag=$(git tag | sort -r | head -1)
unique_tag="release ${current_tag}"
get_task_url="https://api.tracker.yandex.net/v2/issues/_search"

authHeader="Authorization: OAuth ${OAuth}"
orgHeader="X-Org-Id: ${OrganizationId}"
contentType="Content-Type: application/json"

test_result=$(npx jest 2>&1)
test_result_to_JSON="{\"text\": \"$(echo $test_result | tr -d ':' | tr "\r\n" " ")\"}"

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

createCommentUrl="https://api.tracker.yandex.net/v2/issues/${taskKey}/comments"

createCommentStatusCode=$(curl --write-out '%{http_code}' --silent --output /dev/null --location --request POST \
  "${createCommentUrl}" \
  --header "${authHeader}" \
  --header "${orgHeader}" \
  --header "${contentType}" \
  --data-raw "${test_result_to_JSON}"
)

if [ "$createCommentStatusCode" -ne 201 ]
then
    echo "Error with creating comment with test result for issue ${taskKey}"
    exit 1
else
    echo "Successfully created comment with test result for issue ${taskKey}"
fi

if [[ $test_result == *"FAIL"* ]]
then
  echo "Autotests failed"
  exit 1
fi