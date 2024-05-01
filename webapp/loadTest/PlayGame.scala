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
  		"Content-Type" -> "application/json",
  		"Origin" -> "https://cyt.is-cool.dev",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_6 = Map(
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
        .post("/api/game/answer?isHot=false")
        .headers(headers_0)
        .body(RawFileBody("wiq/playgame/0000_request.json")),
      pause(1),
      http("request_1")
        .post("/api/game/answer?isHot=false")
        .headers(headers_0)
        .body(RawFileBody("wiq/playgame/0001_request.json"))
        .resources(
          http("request_2")
            .post("/api/game/answer?isHot=false")
            .headers(headers_0)
            .body(RawFileBody("wiq/playgame/0002_request.json"))
        ),
      pause(2),
      http("request_3")
        .post("/api/game/answer?isHot=false")
        .headers(headers_0)
        .body(RawFileBody("wiq/playgame/0003_request.json")),
      pause(1),
      http("request_4")
        .post("/api/game/answer?isHot=false")
        .headers(headers_0)
        .body(RawFileBody("wiq/playgame/0004_request.json")),
      pause(1),
      http("request_5")
        .post("/api/game/answer?isHot=false")
        .headers(headers_0)
        .body(RawFileBody("wiq/playgame/0005_request.json"))
        .resources(
          http("request_6")
            .get("/jordi-celebration.png")
            .headers(headers_6)
        )
    )

setUp(
  scn.inject(
    atOnceUsers(205), 
    nothingFor(3 seconds),
	rampUsers(405) during(21),
    constantUsersPerSec(48) during (16 seconds)
  ).protocols(httpProtocol)
)

}
