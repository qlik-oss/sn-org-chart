
#!/bin/bash

set -eo pipefail

cd ./dist

echo Zipping Org Chart
zip -r "sn-org-chart.zip" "*"
