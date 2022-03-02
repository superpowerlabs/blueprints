#!/usr/bin/env node

const fspath = require("fspath");
const { preferredOrder } = require("../client/config");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../client/config/allMetadata.json");
const percentageDistribution = require("../client/config/percentageDistribution.json")

let traits = [];
for (let m of metadata) {
      const temp = ([m.tokenId, m.attributes])
      traits.push(temp)
  }

  let per = []

// i = each user
  for(let i =0 ; i< traits.length; i++)
  {
      //j attribute per user

      let totalScore = 0;
      for(let j=0 ; j< traits[i][1].length ; j++)
      {
         

        for( let p in percentageDistribution)
            {
                if(p === traits[i][1][j].trait_type)
                {
                    const key = Object.keys(percentageDistribution[p]);
                    key.forEach((val, index) => {

                        if( val === traits[i][1][j].value )
                        {
                            
                            totalScore = totalScore + (1/(percentageDistribution[p][val]/100))
                            
                        }


                    })
                    

                }
            }
      }
      per.push([traits[i][0],totalScore])

  }


let output = new fspath("./rarityScore.json");
output.write(JSON.stringify(per, null, 2));