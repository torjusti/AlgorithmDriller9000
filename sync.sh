#!/bin/bash
rsync -a . bilde@herkules.bilde.rocks:~/www/AlgorithmDriller9000 --progress --exclude sync.sh
