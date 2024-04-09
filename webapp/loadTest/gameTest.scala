package wiq

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class GameTest extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate, br")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  		"If-None-Match" -> "d2ea4fbac4f7f0cbae9f3eb1d54bed1a7efdb11b",
  		"Sec-Fetch-Dest" -> "document",
  		"Sec-Fetch-Mode" -> "navigate",
  		"Sec-Fetch-Site" -> "none",
  		"Sec-Fetch-User" -> "?1",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "*/*",
  		"If-None-Match" -> "43236382c85c7998e2676f113a3ff8847f700f07",
  		"Sec-Fetch-Dest" -> "script",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_2 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val headers_4 = Map(
  		"Accept" -> "*/*",
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_5 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_6 = Map(
  		"If-None-Match" -> """W/"76-pBSD2dRbUFUs2hjALc0lZ9/PUFo"""",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_7 = Map(
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_9 = Map(
  		"Accept" -> "image/avif,image/webp,*/*",
  		"If-None-Match" -> "ec64264896193a8fcca03d9fa094c1e9471921f3",
  		"Sec-Fetch-Dest" -> "image",
  		"Sec-Fetch-Mode" -> "no-cors",
  		"Sec-Fetch-Site" -> "same-origin"
  )
  
  private val uri1 = "localhost"

  private val scn = scenario("LoginPlay")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/main.7900dc74.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/logo192.png")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/logo192.png")
            .headers(headers_2)
        ),
      pause(10),
      http("request_4")
        .options("/login")
        .headers(headers_4)
        .resources(
          http("request_5")
            .post("/login")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0005_request.json")),
          http("request_6")
            .get("/categories")
            .headers(headers_6)
        ),
      pause(1),
      http("request_7")
        .get("/questions/area/10")
        .headers(headers_7)
        .resources(
          http("request_8")
            .options("/history/create")
            .headers(headers_4),
          http("request_9")
            .get("http://" + uri1 + ":3000/static/media/coin.d9b2a399ca98dfa306307d962ae97c7b.svg")
            .headers(headers_9),
          http("request_10")
            .get("http://" + uri1 + ":3000/static/media/border.92f314d03f3a855655d1.png")
            .headers(headers_2),
          http("request_11")
            .post("/history/create")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0011_request.json"))
        ),
      pause(2),
      http("request_12")
        .options("/game/answer")
        .headers(headers_4)
        .resources(
          http("request_13")
            .post("/game/answer")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0013_request.json")),
          http("request_14")
            .options("/history/add/66152027945b571613f73b6c")
            .headers(headers_4),
          http("request_15")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0015_request.json"))
        ),
      pause(2),
      http("request_16")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0016_request.json"))
        .resources(
          http("request_17")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0017_request.json"))
        ),
      pause(1),
      http("request_18")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0018_request.json"))
        .resources(
          http("request_19")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0019_request.json"))
        ),
      pause(1),
      http("request_20")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0020_request.json"))
        .resources(
          http("request_21")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0021_request.json"))
        ),
      pause(1),
      http("request_22")
        .options("/game/answer")
        .headers(headers_4)
        .resources(
          http("request_23")
            .post("/game/answer")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0023_request.json")),
          http("request_24")
            .options("/history/add/66152027945b571613f73b6c")
            .headers(headers_4),
          http("request_25")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0025_request.json"))
        ),
      pause(1),
      http("request_26")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0026_request.json"))
        .resources(
          http("request_27")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0027_request.json"))
        ),
      pause(1),
      http("request_28")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0028_request.json"))
        .resources(
          http("request_29")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0029_request.json"))
        ),
      pause(1),
      http("request_30")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0030_request.json"))
        .resources(
          http("request_31")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0031_request.json"))
        ),
      pause(1),
      http("request_32")
        .post("/game/answer")
        .headers(headers_5)
        .body(RawFileBody("wiq/loginplay/0032_request.json"))
        .resources(
          http("request_33")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0033_request.json"))
        ),
      pause(1),
      http("request_34")
        .options("/game/answer")
        .headers(headers_4)
        .resources(
          http("request_35")
            .post("/game/answer")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0035_request.json")),
          http("request_36")
            .options("/history/add/66152027945b571613f73b6c")
            .headers(headers_4),
          http("request_37")
            .post("/history/add/66152027945b571613f73b6c")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0037_request.json")),
          http("request_38")
            .options("/addScore")
            .headers(headers_4),
          http("request_39")
            .get("http://" + uri1 + ":3000/jordi-celebration.png")
            .headers(headers_2),
          http("request_40")
            .post("/addScore")
            .headers(headers_5)
            .body(RawFileBody("wiq/loginplay/0040_request.json"))
            .check(status.is(503))
        )
    )

		setUp(
		scn.inject(constantUsersPerSec(2) during (120 seconds)
			randomized)
	).protocols(httpProtocol)
}
