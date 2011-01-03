#!/bin/bash

HERE="$(dirname $0)"

"$HERE/mogrif.sh"
rsync --progress -r "$HERE"/ slog.dk:~janravnborg/havejan.dk/docroot/

