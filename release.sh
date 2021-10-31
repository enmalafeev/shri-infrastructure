#!/bin/bash

export LAST_RELEASE_TAG=$(git describe)
export DIFF_BETWEEN_LAST_TAGS=$(git log $(git describe --abbrev=0 --tags $(git describe --abbrev=0)^)...$(git describe --abbrev=0))

echo "${DIFF_BETWEEN_LAST_TAGS}"
