package wiq

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class LoginUser extends Simulation {

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
  		"Sec-Fetch-Site" -> "cross-site",
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
  		"If-None-Match" -> """W/"76-pBSD2dRbUFUs2hjALc0lZ9/PUFo"""",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_5 = Map(
  		"Accept" -> "*/*",
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val headers_6 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://localhost:3000",
  		"Sec-Fetch-Dest" -> "empty",
  		"Sec-Fetch-Mode" -> "cors",
  		"Sec-Fetch-Site" -> "same-site"
  )
  
  private val uri1 = "localhost"

  private val scn = scenario("LoginUser")
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
      pause(5),
      http("request_4")
        .get("/categories")
        .headers(headers_4),
      pause(57),
      http("request_5")
        .options("/login")
        .headers(headers_5)
        .resources(
          http("request_6")
            .post("/login")
            .headers(headers_6)
            .body(RawFileBody("wiq/loginuser/0006_request.json")),
          http("request_7")
            .get("/categories")
            .headers(headers_4)
        )
    )

	setUp(scn.inject(constantUsersPerSec(70) during (120 seconds)
			randomized)).protocols(httpProtocol)
}
