module.exports = {
    userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:8001",

    insertSampleUser: async (axios) => {

        const body = {
            username: "prueba",
            password: "Prueba1213$"
        }

        try{
            console.log("Inserting sample user for e2e tests...")
            const response = await axios.post(`http://localhost:8001/adduser`, body)
        }catch(error){
            console.error("Error inserting sample user for e2e tests: " + error)
        }
    },
    insertGroups: async (axios) => {
        try{
            console.log("Inserting groups for e2e tests...")
            await axios.post(`http://localhost:8003/addGroups`, groups)
            await axios.get(`http://localhost:8003/gen`)
        }catch(error){
            console.error("Error inserting groups for e2e tests: " + error)
        }
    }
}

const groups =  [
  {
      "groupId": "capitals",
      "questionItem": "Q6256",
      "answer": "P36",
      "statements": [
          "The capital of <QuestionItem> is...",
          "What is the capital of <QuestionItem>?",
          "Select the capital of <QuestionItem>"
      ],
      "categories": [
          "capitals",
          "geography"
      ]
  },
    {
        "groupId": "continent",
        "questionItem": "Q6256",
        "answer": "P30",
        "statements": [
            "The continent of <QuestionItem> is...",
            "What is the continent of <QuestionItem>?",
            "Select the continent of <QuestionItem>"
        ],
        "categories": [
            "continent",
            "geography"
        ]
    },
    {
        "groupId": "languages",
        "questionItem": "Q6256",
        "answer": "P37",
        "statements": [
            "The language spoken in <QuestionItem> is...",
            "What is the language spoken in <QuestionItem>?",
            "Select the language spoken in <QuestionItem>"
        ],
        "categories": [
            "languages",
            "geography"
        ]
    },
    {
        "groupId": "population",
        "questionItem": "Q6256",
        "answer": "P1082",
        "statements": [
            "The population of <QuestionItem> is...",
            "What is the population of <QuestionItem>",
            "Select the population of <QuestionItem>"
        ],
        "categories": [
            "population",
            "geography"
        ],
        "plainText": true,
        "filter": "FILTER(LANG(?question) = 'en')"
    },
    {
        "groupId": "area",
        "questionItem": "Q6256",
        "answer": "P2046",
        "statements": [
            "The area of <QuestionItem> is...",
            "What is the area of <QuestionItem>",
            "Select the area of <QuestionItem>"
        ],
        "categories": [
            "area",
            "geography"
        ],
        "plainText": true,
        "filter": "FILTER(LANG(?question) = 'en')"
    },
    {
        "groupId": "gdp",
        "questionItem": "Q6256",
        "answer": "P2131",
        "statements": [
            "The GDP of <QuestionItem> is...",
            "What is the GDP of <QuestionItem>",
            "Select the GDP of <QuestionItem>"
        ],
        "categories": [
            "gdp",
            "geography"
        ],
        "plainText": true,
        "filter": "FILTER(LANG(?question) = 'en')"
    },
    {
        "groupId": "currency",
        "questionItem": "Q6256",
        "answer": "P38",
        "statements": [
            "The currency of <QuestionItem> is...",
            "What is the currency of <QuestionItem>",
            "Select the currency of <QuestionItem>"
        ],
        "categories": [
            "currency",
            "geography",
            "economy"
        ]
    },
    {
        "groupId": "president",
        "questionItem": "Q6256",
        "answer": "P35",
        "statements": [
            "The president of <QuestionItem> is...",
            "Who is the president of <QuestionItem>",
            "Select the president of <QuestionItem>"
        ],
        "categories": [
            "president",
            "geography",
            "politics"
        ]
    }
  ]