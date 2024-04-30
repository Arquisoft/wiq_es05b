package wiq

class PlayGame extends Simulation {

  private val httpProtocol = http
    .baseUrl("https://cyt.is-cool.dev")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate, br")
    .acceptLanguageHeader("en")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"If-None-Match" -> "c49c469e11c898b25c7c0a68a460ae63544d991a",
  		"Sec-Fetch-Dest" -> "document",
  		"Sec-Fetch-Mode" -> "navigate",
  		"Sec-Fetch-Site" -> "none",
  		"Sec-Fetch-User" -> "?1",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "*/*",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"If-None-Match" -> "ca400ec24dddb7a81451d193b0ca9221a784c7af",
  		"Sec-Fetch-Dest" -> "script",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_2 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_4 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "https://cyt.is-cool.dev",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_5 = Map(
  		"If-None-Match" -> """W/"76-pBSD2dRbUFUs2hjALc0lZ9/PUFo"""",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-origin",
  		"authorization" -> "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMxNWJkYTM3YzJlM2IxNWU4N2U4MTkiLCJpYXQiOjE3MTQ1MTA4ODQsImV4cCI6MTcxNDUyNTI4NH0.nqg7QMZ1LJbl3w9--OIOlP6D2qVrYt6JUX-FTGK5Q6s"
  )
  
  private val headers_7 = Map(
  		"If-None-Match" -> """W/"79f-hZwvqvlLjGWHnaqfQMNU0O4SMG4"""",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-origin",
  		"authorization" -> "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjMxNWJkYTM3YzJlM2IxNWU4N2U4MTkiLCJpYXQiOjE3MTQ1MTA4ODQsImV4cCI6MTcxNDUyNTI4NH0.nqg7QMZ1LJbl3w9--OIOlP6D2qVrYt6JUX-FTGK5Q6s"
  )
  
  private val headers_8 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"If-None-Match" -> "fa22e4493f8dd64e51cb96adb8b94c0a4f662cc5",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_9 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"If-None-Match" -> "a377f3e105a0c58c455537c232a8bdab017962c4",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_20 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"Accept-Language" -> "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  		"If-None-Match" -> "0b13ee8600e3b97ab410ea19942780d76e9756c5",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )


  private val scn = scenario("PlayGame")
    .exec(
      http("request_0")
        .get("/home")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/static/js/main.883c6c3c.js")
            .headers(headers_1),
          http("request_2")
            .get("/logo192.png")
            .headers(headers_2),
          http("request_3")
            .get("/logo192.png")
            .headers(headers_2)
        ),
      pause(17),
      http("request_4")
        .post("/api/login")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0004_request.json"))
        .resources(
          http("request_5")
            .get("/api/game/categories")
            .headers(headers_5)
        ),
      pause(3),
      http("request_6")
        .post("/api/history/create")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0006_request.json"))
        .resources(
          http("request_7")
            .get("/api/game/questions/capitals/10")
            .headers(headers_7),
          http("request_8")
            .get("/static/media/coin.min.3ce18f0c750fafeebf39e280876ac2b9.svg")
            .headers(headers_8),
          http("request_9")
            .get("/static/media/border.ad2f658a1b45ceb1d7a3.png")
            .headers(headers_9),
          http("request_10")
            .post("/api/game/answer?isHot=false")
            .headers(headers_4)
            .body(RawFileBody("wiq/playgame/0010_request.json"))
        ),
      pause(2),
      http("request_11")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0011_request.json")),
      pause(2),
      http("request_12")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0012_request.json")),
      pause(3),
      http("request_13")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0013_request.json")),
      pause(2),
      http("request_14")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0014_request.json")),
      pause(1),
      http("request_15")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0015_request.json")),
      pause(1),
      http("request_16")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0016_request.json")),
      pause(1),
      http("request_17")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0017_request.json")),
      pause(1),
      http("request_18")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0018_request.json")),
      pause(1),
      http("request_19")
        .post("/api/game/answer?isHot=false")
        .headers(headers_4)
        .body(RawFileBody("wiq/playgame/0019_request.json"))
        .resources(
          http("request_20")
            .get("/jordi-celebration.png")
            .headers(headers_20)
        )
    )

		setUp(scn.inject(constantUsersPerSec(38) during (60 seconds)randomized)).protocols(httpProtocol)
}
