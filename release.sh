#!/bin/bash

CURRENT_TAG=$(git tag | sort -r | head -1)
PREVIOS_TAG=$(git tag | sort -r | head -2 | tail -1)
DIFF_BETWEEN_LAST_TAGS=$(git log $(git describe --abbrev=0 --tags $(git describe --abbrev=0)^)...$(git describe --abbrev=0))
CURRENT_TAG_AUTHOR=$(git show ${CURRENT_TAG} | grep Author: )
CURRENT_TAG_DATE=$(git show ${CURRENT_TAG} | grep Date:)
LOG=$(git log $PREVIOS_TAG..$CURRENT_TAG)

echo "${CURRENT_TAG_AUTHOR}"
