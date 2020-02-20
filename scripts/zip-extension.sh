
#!/bin/bash

set -eo pipefail
echo Zipping Org Chart
zip -r "sn-org-chart.zip" "./dist"
