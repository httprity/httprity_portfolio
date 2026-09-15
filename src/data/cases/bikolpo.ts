/** Bikolpo case study: plain-language explanations with the original figures and technical specifics. */
export const bikolpo = {
  "slug": "bikolpo",
  "index": "003",
  "name": "Bikolpo",
  "bengali": "বিকল্প",
  "tagline": "I built Bikolpo to help delivery teams in Dhaka decide which trips need a different route when heavy rain is expected.",
  "hero": "/work/bikolpo.webp",
  "heroAlt": "Bikolpo landing page and dispatch dashboard: “Bikolpo changes the route” beside a Today board reading 64 trips planned, 21 need attention, 10 can be rerouted, 11 no better route.",
  "meta": [
    {
      "k": "What I built",
      "v": "A working demo that combines a flood prediction model with a delivery planning dashboard. I built it on my own for an exhibition. It is not a service used by a real delivery team."
    },
    {
      "k": "My role",
      "v": "I decided what the product should do, designed the screens, created the training data, trained and tested the model, built the server and website, and prepared the deployment setup. I used AI tools while rebuilding the frontend."
    },
    {
      "k": "Timeline",
      "v": "November 2025: I built the first version, which helped one person find a route. September 2026: I rebuilt it for delivery teams after finding problems with both the original product idea and the model’s training data."
    },
    {
      "k": "Current status",
      "v": "The prototype works. The model was trained on computer-generated flood examples and tested on roads excluded from training. It has not been tested against real floods. The interface makes this limitation clear."
    }
  ],
  "glance": [
    {
      "value": "64",
      "label": "delivery trips checked for one evening"
    },
    {
      "value": "3",
      "label": "possible recommendations for each trip"
    },
    {
      "value": "0.9968",
      "label": "ROC-AUC: how well it ranks flood risk in simulated test data"
    },
    {
      "value": "874k",
      "label": "generated examples, each covering one road section for one hour"
    },
    {
      "value": "67",
      "label": "automated tests, using the real model and stand-in routing responses"
    },
    {
      "value": "0",
      "label": "new requests to the route provider when rainfall changes"
    }
  ],
  "stack": [
    {
      "group": "Server",
      "items": [
        "Python",
        "FastAPI",
        "Background processing",
        "RLock: prevents conflicting updates",
        "HTTP 409: retry after analysis"
      ],
      "note": "The server keeps one delivery board in memory inside one running process. It checks trips in the background so the interface can stay responsive.\n\nI kept route finding and flood prediction separate. The route finder supplies roads; the prediction code checks those roads. Each part can change without rewriting the other."
    },
    {
      "group": "Prediction model",
      "items": [
        "scikit-learn HistGradientBoosting",
        "Rules that keep predictions consistent",
        "NumPy · pandas",
        "Testing on roads excluded from training",
        "Checking which inputs affect predictions"
      ],
      "note": "The model uses 18 inputs, such as rainfall and road height. Training stopped after 85 rounds when further rounds stopped helping. The algorithm is called HistGradientBoosting.\n\nI added monotonic constraints: rules that stop predicted flood risk from falling as rain increases. I checked the model on roads it had not trained on (spatial hold-out validation), and shuffled individual inputs to see which ones mattered (permutation importance).\n\nI did not give flood examples extra weight during training. That made the estimated probabilities more realistic. This matters because the app compares those estimates when choosing between routes."
    },
    {
      "group": "Roads & weather",
      "items": [
        "Flood simulation based on physical factors",
        "OpenRouteService: road routes",
        "Open-Meteo: weather",
        "IDW: terrain estimated from 26 reference points",
        "Saved routes in JSON files"
      ],
      "note": "I did not have road-by-road flood records for Dhaka, so I generated training examples from rainfall, rivers, terrain, and drainage.\n\nStorm arrivals use a Poisson process. Storm intensity uses a Gamma distribution, which allows occasional very heavy storms. River levels use an AR(1) process, where the previous level influences the next. Terrain changes how much rain a road can take before it floods. These are assumptions in the simulator, not observations of real floods."
    },
    {
      "group": "Website & maps",
      "items": [
        "Vanilla ES modules",
        "MapLibre GL",
        "SVG atlas",
        "WebGL / GLSL",
        "GSAP ScrollTrigger",
        "One tokens.css, two modes"
      ],
      "note": "I built a visual landing page and a simpler dashboard for planning trips. Both use the same colors from one tokens.css file. Amber and red are reserved for flood warnings.\n\nVanilla ES modules organize the JavaScript. MapLibre GL draws the maps; an SVG atlas provides vector map artwork; WebGL and GLSL draw graphics; GSAP ScrollTrigger controls scroll animations."
    },
    {
      "group": "Tests & deployment",
      "items": [
        "pytest (67)",
        "Docker",
        "Render blueprint",
        "preflight.py",
        "smoke_test.py (16 checks)",
        "pre-commit secret hook"
      ],
      "note": "The project has 67 pytest tests and a smoke_test.py script with 16 basic checks. Each test file explains which failure it protects against.\n\nDocker packages the app, and a Render blueprint describes the deployment setup. The Docker build stops if the model cannot load. preflight.py checks the files needed for deployment. A pre-commit check looks for secrets before code is committed."
    }
  ],
  "problem": {
    "lede": "During the monsoon, some roads in Dhaka flood much sooner than others. Low areas include the Buriganga riverfront, Kamrangirchar, Mirpur–Pallabi, and the Turag floodplain at Tongi. With 60 mm of rain, a height difference of two metres and a blocked drain can change whether a road is usable.",
    "body": [
      "A delivery team may send out dozens of trips in the evening, just as monsoon rain arrives. Its route planner finds the fastest roads, but those roads may pass through low ground that floods.",
      "The person planning deliveries already has a schedule: in this example, 64 trips between 5 PM and 9:30 PM. They need to know which trips may run into trouble and what they can change. A flood map alone does not answer those questions."
    ],
    "hard": [
      [
        "There was no road-by-road flood history to train on",
        "There were no road sensors or historical flood records for each road section. I could not train the model directly on observations that were not available."
      ],
      [
        "The fastest route may still flood",
        "Route services such as OpenRouteService (ORS), Google, and OSRM optimize travel cost. The alternatives they return may still pass through the same low-lying area."
      ],
      [
        "A different route is not always better",
        "Avoiding one flooded area in Dhaka can take a driver through another. The product needs to say when it cannot find a useful alternative. It should not always recommend a detour."
      ],
      [
        "Too many warnings make it hard to choose what to do",
        "A person planning deliveries cannot easily review 40 flagged trips at once. If almost every trip gets a warning, the warnings stop helping them set priorities."
      ]
    ]
  },
  "idea": {
    "heading": "I changed it from a route finder into a tool for delivery teams.",
    "body": [
      "The first version let someone enter a start and end point and find the safest route. It worked and had a Bengali welcome screen, but I realized I had chosen the wrong problem. I shifted the focus to a delivery team managing around sixty trips.",
      "The team already has a plan. Instead of asking them to search for each route again, I built Bikolpo to check the whole plan against the evening’s weather. It gives one of three answers for each trip."
    ],
    "outcomes": [
      {
        "key": "reroute",
        "label": "Reroute recommended",
        "short": "Use another route. The app shows the improvement and any extra travel time.",
        "detail": "I only recommend another route when it reduces the estimated amount of the journey on flood-prone roads by at least 12% and adds no more than 20 minutes. The route row shows both numbers, for example: “No extra time · 15% less exposure.” Here, exposure means the estimated share of the journey on flooded road."
      },
      {
        "key": "keep",
        "label": "No better route found",
        "short": "The trip is still at risk, but the app has not found a better route.",
        "detail": "This is often the result on a very wet evening. I show it as a separate count and label so the user can distinguish a warning they can act on from one they cannot fix by changing routes.\n\nAn automated test checks that trips with an alternative plus trips with no better route equal all trips needing attention: alternatives + no_better_route == need_attention."
      },
      {
        "key": "ontrack",
        "label": "On track",
        "short": "The checked route does not need a change.",
        "detail": "A trip can only be marked “On track” after it has been checked. If the route service cannot provide a route to check, I label it “Not assessed”. Missing information must never look like a successful check."
      }
    ],
    "insight": {
      "title": "Save the routes once. Check them again when the rain changes.",
      "body": "Rain changes a road’s estimated flood risk, not the line showing where the road is. I store those route lines and reuse them without expiring the cache.\n\nWhen the forecast changes, someone moves the rain control, or the app checks a range of rainfall levels, it runs the model on those saved routes. It does not ask the route provider for them again. That makes updates fast and lets the app keep working when the route service is unavailable."
    }
  },
  "board": {
    "scenario": "Heavy rain expected · 6 PM – 10 PM · 72 mm",
    "scenarioLabel": "Exhibition scenario",
    "counts": {
      "planned": 64,
      "attention": 21,
      "reroutable": 10,
      "noBetter": 11
    },
    "trip": {
      "corridor": "Mirpur → Motijheel",
      "current": {
        "minutes": 12,
        "exposure": "Severe flood exposure"
      },
      "proposed": {
        "minutes": 12,
        "exposure": "High flood exposure",
        "delta": "Same travel time · 15% less estimated exposure to flooding"
      },
      "why": "The current route includes a road that may become difficult in tonight’s rain. The alternative reduces the estimated exposure to flooding by 15%, with no extra travel time. This is an estimate based on rainfall, road height, and drainage. It is not a measurement of water on the road."
    },
    "impact": "1 trip rerouted · no extra travel time",
    "impactSub": "Estimated exposure to flooding is 15% lower for the changed trip"
  },
  "storm": [
    {
      "mm": 8,
      "title": "Light rain",
      "fastest": {
        "minutes": 16,
        "exposure": "Clear",
        "level": 0
      },
      "bikolpo": {
        "minutes": 16,
        "exposure": "Clear",
        "level": 0
      },
      "verdict": "On track",
      "note": "Both routes take 16 minutes. Nothing to change."
    },
    {
      "mm": 71,
      "title": "Heavy rain",
      "fastest": {
        "minutes": 16,
        "exposure": "High exposure",
        "level": 2
      },
      "bikolpo": {
        "minutes": 18,
        "exposure": "Moderate exposure",
        "level": 1
      },
      "verdict": "Reroute recommended",
      "note": "The fastest route takes 16 minutes but passes through ground more likely to flood. The alternative takes 18 minutes and uses higher ground."
    },
    {
      "mm": 134,
      "title": "Extreme rain",
      "fastest": {
        "minutes": 16,
        "exposure": "Severe exposure",
        "level": 3
      },
      "bikolpo": {
        "minutes": 16,
        "exposure": "Severe exposure",
        "level": 3
      },
      "verdict": "No better route found",
      "note": "All the routes have severe exposure to flooding. Taking a detour would not help enough, so the app says it has not found a better route."
    }
  ],
  "pipeline": [
    {
      "step": "Find possible routes",
      "tag": "Save the road paths",
      "detail": "I request routes from OpenRouteService and save them to disk. I always keep the original fastest route for comparison.\n\nI request up to three alternatives, asking for as little overlap as ORS allows. I also try two detours through points about 5 km away from the direct path. For trips already flagged for attention, I try an additional fourth candidate that avoids the stretches expected to flood."
    },
    {
      "step": "Check the ground along each route",
      "tag": "Height & drainage",
      "detail": "The app estimates seven fixed properties at points along each route, including elevation, drainage, flood susceptibility, hotspot status, and slope.\n\nI use 26 hand-placed reference points around Dhaka. Nearby reference points have more influence than distant ones; this is called inverse-distance weighting (IDW). For example, Sadarghat is represented at 2.5 m with drainage 0.20, and Cantonment at 10 m with drainage 0.82. These are values in the terrain model.\n\nThe results are reused for the same route using an LRU cache, which retains recently used results. Ground conditions do not need to be recalculated whenever rain changes."
    },
    {
      "step": "Add the weather and time",
      "tag": "Live data or a labeled demo",
      "detail": "The app adds 11 weather and time inputs. These include rainfall over 6, 12, and 24 hours (R6h, R12h, R24h), river level, month, and hour.\n\nThey come from Open-Meteo or the exhibition scenario. The screen always says which source it is using."
    },
    {
      "step": "Estimate flood risk for each road section",
      "tag": "Run the prediction model",
      "detail": "A gradient-boosted classifier estimates how likely each road section is to flood. This is a model built by combining many small decision trees. A Mirpur → Motijheel route contains about 216–328 sections.\n\nThe server sends the sections for the whole operation through the model together, in one batch, instead of calling it separately for every trip."
    },
    {
      "step": "Combine the results for the whole route",
      "tag": "Longer sections count more",
      "detail": "The app estimates what share of the journey may be on flooded road. Longer sections contribute more to this number. That is the route’s “exposure”.\n\nI rejected a different measure: the chance that any section floods. That number changes if a route provider divides the same road into more pieces.\n\nThe app also joins neighboring risky sections into a single stretch. This lets the explanation say “one road” instead of “47 segments”."
    },
    {
      "step": "Decide which trips need attention",
      "tag": "High or severe exposure",
      "detail": "I flag trips with high or severe exposure. This is a rule I chose for the product, not a decision the model makes by itself.\n\nIn one wet-evening test, including moderate exposure flagged 37 of 64 trips. That was too many to prioritize. Using high and severe surfaced roughly a dozen in that test. The number varies with the scenario. An automated test checks the threshold itself."
    },
    {
      "step": "Check whether a detour is worth taking",
      "tag": "Up to 20 extra minutes",
      "detail": "An alternative must reduce exposure by at least 12% and add no more than 20 minutes. If no route meets both rules, the app says “No better route found”.\n\nThe app compares routes using cost = minutes + 100 × exposure. This combines travel time and estimated exposure into one number, with lower values preferred."
    }
  ],
  "model": {
    "metrics": [
      {
        "k": "Risk ranking (ROC-AUC)",
        "v": "0.9968",
        "ref": "How well it ranks flooded sections above dry ones. 0.5 is random; 1 is perfect."
      },
      {
        "k": "Finding rare floods (PR-AUC)",
        "v": "0.8197",
        "ref": "Balances finding floods with avoiding false alarms. Baseline: 0.0060."
      },
      {
        "k": "Prediction error (Brier)",
        "v": "0.00230",
        "ref": "Lower is better. Always predicting the base flood rate gives 0.00600."
      },
      {
        "k": "Average prediction / actual rate",
        "v": "0.0064 / 0.0060",
        "ref": "The average predicted rate is close to, and slightly above, the rate in the simulated test data."
      }
    ],
    "validation": "I set aside 120 entire road sections before training and used them only for testing. Both sets cover the full year. This checks whether the model can work on roads it did not train on.\n\nI rejected a simple split by date because the end of the calendar year contains the dry season after the monsoon. That would be a misleading test.\n\nI also shuffled individual inputs to see how much predictions depended on them. This check, called permutation importance, showed that 12-hour and 24-hour rainfall mattered most, followed by terrain. That is the behavior I wanted.",
    "constraints": [
      [
        "More rain should not produce a lower flood estimate",
        "The original model sometimes predicted less exposure as rainfall rose from 80 to 140 mm. I added rules called monotonic constraints to prevent this. The estimates now move in the expected direction across 0–200 mm.\n\nThe rules cover rainfall, river level, road height, and drainage. They also cover temperature and humidity because the simulator derives those values from rainfall."
      ],
      [
        "The size of the estimate matters, not just the ranking",
        "Only 0.67% of the training examples involved flooding. I tried giving those examples more weight so the model would pay more attention to them.\n\nRanking barely changed: ROC-AUC was 0.969 versus 0.970. But the average predicted risk became eleven times the true rate, and Brier error worsened from about 0.005 to 0.056.\n\nI removed that weighting. Bikolpo compares estimates across routes, so those estimates need to match the data reasonably well. This is called calibration."
      ],
      [
        "Stop the model from seeing the answer during training",
        "In version one, an input was the target label divided by a constant. The model could effectively read the answer instead of learning to predict floods.\n\nI created a FORBIDDEN input list. It blocks the simulator’s own flood probability, its hidden per-road bias, and raw coordinates. Training stops with an error if any of these appear; it does not silently remove them."
      ]
    ],
    "notModel": "These results do not prove that Bikolpo can predict real floods. The model has only learned from a simulation I wrote.\n\nFor predictions above 0.35, it tends to overestimate risk. That may be preferable to underestimating risk in a warning tool, but the estimates are still biased.",
    "curve": [
      {
        "mm": 40,
        "trips": 0,
        "demo": false
      },
      {
        "mm": 60,
        "trips": 21,
        "demo": false
      },
      {
        "mm": 72,
        "trips": 21,
        "demo": true
      },
      {
        "mm": 80,
        "trips": 64,
        "demo": false
      }
    ],
    "curveNote": "The prototype gives every road the same city-wide rainfall value. That makes many trips change status together: none need attention at 40 mm, 21 at 60 mm, and all 64 at 80 mm.\n\nThe 72 mm demo sits in the narrow range where some trips are affected and others are not. Rainfall that varies by area is the first improvement I want to make. Source: the app’s /api/storm-curve results."
  },
  "design": [
    [
      "Use words the person planning deliveries can act on",
      "Road sections are labeled Clear, Caution, Difficult, or Avoid. Whole routes are labeled Low, Moderate, High, or Severe flood exposure. I do not display raw prediction probabilities as scores.\n\nAn automated test checks generated explanations for technical words such as “classifier”, “probability”, “model”, “feature”, and “synthetic”. It fails if those words appear."
    ],
    [
      "Always say whether the weather is real or a demo",
      "The weather panel has three explicit labels: “Exhibition scenario”, “Live conditions”, or “Weather unavailable · fallback scenario”.\n\nThe user should not have to guess from a rainfall number whether the app is showing a forecast or a demo."
    ],
    [
      "Keep warning colors meaningful",
      "The landing page and dashboard use one shared tokens.css file for colors. The landing page is more animated; the dashboard is calmer.\n\nAmber and red only indicate exposure to flooding. I do not use them as decoration elsewhere in the product."
    ],
    [
      "Use animation to show what changed",
      "When someone changes a route, the count moves from 21 to 20 instead of suddenly replacing the number. New routes are drawn onto the map.\n\nA timeout makes each animation reach the correct final value even if animation frames stop running. The prefers-reduced-motion setting turns the animations off."
    ],
    [
      "Keep the rain experiment separate from daily planning",
      "A rainfall control is useful for exploring the model, but someone could mistake it for a real forecast. I put it outside the daily workflow and labeled it “Model explorer · not a forecast”."
    ],
    [
      "Only report results the app can measure",
      "After a route change, I show how many trips changed and how many minutes were added. A delivery team can check those figures afterward.\n\nI do not claim money saved or deliveries rescued because the prototype does not measure either."
    ]
  ],
  "engineering": [
    [
      "Reuse saved routes when the weather changes",
      "I save each candidate route using its start, destination, vehicle, and tag as a key. Changing the weather then needs zero new requests to the route provider.\n\nTo check 21 rainfall levels, the app groups 64 trips into about 20 unique combinations of journey and vehicle, avoiding duplicate work. This runs in seconds.\n\nThe saved routes are included in the Docker image. I tested startup with a dummy API key and no route-provider access; the complete board still loaded."
    ],
    [
      "Keep the app useful when the route service hits its limit",
      "The free route service allows 40 requests a minute and has a daily quota. I space requests 1.7 seconds apart.\n\nAfter four failures in a row, a circuit breaker pauses new requests for two minutes and uses saved routes. A circuit breaker is a rule that temporarily stops calls to a failing service.\n\nIf more than a quarter of trips cannot be routed, the app rebuilds the trip list from saved journeys. The result is a smaller usable board instead of a larger empty one."
    ],
    [
      "Prevent two actions from overwriting each other",
      "The server checks trips in a background thread. If someone tries to change a route during that check, it returns HTTP 409, meaning the action conflicts with work in progress.\n\nWhen the weather refreshes, an accepted route is checked again but is not replaced. The person’s decision is preserved. If the same trip appears more than once in a bulk request, it is counted once."
    ],
    [
      "Catch deployment problems before the app starts",
      "The Dockerfile copies about 1 MB from an approximately 830 MB repository. It pins Python and scikit-learn to versions compatible with the saved model file, called a pickle. The build fails if that file cannot load.\n\npreflight.py checks that every COPY source exists and no secret is staged for a commit. A pre-commit hook also blocks credentials. I added it after a real key entered a commit; the README discloses that mistake and says to rotate the key."
    ]
  ],
  "learned": [
    [
      "A high test score can hide a broken model.",
      "My first model could get the answer from one of its inputs. I fixed the training setup: block answer-revealing inputs, test on whole roads excluded from training, and check whether rainfall actually influences the predictions."
    ],
    [
      "A useful risk estimate needs to be realistic.",
      "Giving extra weight to a positive class of about 0.6% slightly improved ranking but made the estimated probabilities eleven times too large. Because Bikolpo compares routes using these numbers, realistic estimates mattered more than the small ranking gain."
    ],
    [
      "Choosing the right user changed the whole product.",
      "I changed the question from “What is the safest route from A to B?” to “Which of tonight’s 64 trips need attention, and which can be improved?” That changed the server API, how decisions are stored, the screens, and what a useful answer looks like."
    ]
  ],
  "next": [
    [
      "Test against real flood records",
      "Build an independent test set from recorded road closures, drainage reports, satellite images of standing water, and rainfall records. The model should not influence how that test set is assembled. Until then, Bikolpo remains a prototype, as the interface states."
    ],
    [
      "Use local rainfall for each trip",
      "The weather provider already accepts latitude and longitude. Requesting weather per trip would avoid giving the whole city one rainfall value and help prevent so many trips from changing status at once."
    ],
    [
      "Use better terrain data and traffic estimates",
      "Replace the 26 reference points with a surveyed digital elevation model (DEM), which records ground height in detail. The rest of the prediction process can stay the same because it reads terrain through one function: terrain_at().\n\nTravel times also need to account for congestion before the 20-minute detour limit can be useful in real traffic."
    ],
    [
      "Save decisions permanently and support a team",
      "Decisions currently live in process memory, so they are lost when the server stops. A real team needs permanent storage, several users working at once, and an API to import trips. The existing /api endpoints provide a starting structure for that work."
    ]
  ]
} as const;

export type BikolpoCase = typeof bikolpo;
