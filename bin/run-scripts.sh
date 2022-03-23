#!/usr/bin/env bash

node scripts/extractPercentageDistribution.js 
node scripts/extractRarityDistribution.js 
node scripts/extractRarityScore.js 
node scripts/addRarityScoreToAll.js
node scripts/sortByRarityScore.js  
node scripts/extractValueScore.js
node scripts/addValueScore.js
node scripts/sortByValueScore.js