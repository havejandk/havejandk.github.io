#!/bin/bash

HERE="$(dirname ${0})"

MOGRIF_ARGS="-auto-orient -quality 85 -interlace PLANE -format jpg"

find_pictures() {
  find "$@" -iregex '.*\.\(png\|jpe?g\|gif\)' -printf "%P\0" 
}
find_dirs() {
  find "$@" -type d -printf "%P\0"
}

transform_dir() {
    from_dir="$1"
    shift
    to_dir="$1"
    shift
    echo 1>&2 "Processing $to_dir"
    find_dirs "$from_dir" | while read -d $'\0' d; do
	mkdir -p "$to_dir/$d"
    done
    find_pictures "$from_dir" | while read -d $'\0' p; do
	src="$from_dir/$p"
	dst="$to_dir/${p%%.*}.jpg"
	echo -n 1>&2 "$src -> $dst"
	if test "$src" -nt "$dst"; then
	    echo 1>&2 -n "...CONVERT"
	    convert "$src" ${MOGRIF_ARGS} "$@" "$dst"
	    echo 1>&2 "...OK"
	else
	    echo 1>&2 "...SKIPPED"
        fi
    done
}

transform_dirs() {
  transform_dir "$HERE/orig" "$HERE/thumb" -colors 256 -depth 8 -thumbnail "120x90>"
  transform_dir "$HERE/orig" "$HERE/album" -resize 1024
}

transform_dirs

