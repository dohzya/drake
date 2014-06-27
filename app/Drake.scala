package controllers {

  import play.api._
  import play.api.mvc._

  object Drake extends Controller {

    def router = Action { Ok(play.router.DrakeRouter.routingInfos) }

  }

}

package play.router {

  import java.io.File
  import org.apache.commons.io.FileUtils
  import play.api.libs.json._
  import scala.collection.immutable.ListMap
  import scala.io.Codec
  import scala.util.parsing.combinator._
  import scala.util.parsing.input._

  object DrakeRouter {
    import play.router.RoutesCompiler._

    def generate(file: File, prefix: String = "/"): JsValue = {
      Json.obj(
        "type" -> "router",
        "prefix" -> prefix,
        "rules" -> JsArray(compile(file) map transformRule)
      )
    }

    def transformRule(rule: Rule): JsValue = rule match {
      /*
      case class Route(verb: HttpVerb, path: PathPattern, call: HandlerCall, comments: List[Comment] = List()) extends Rule
      case class Include(prefix: String, router: String) extends Rule
      */
      case Route(verb, path, call, comments) =>
        Json.obj(
          "type" -> "route",
          "verb" -> verb.value,
          "path" -> JsArray(path.parts map {
            case DynamicPart(name, constraint, encode) =>
              Json.obj(
                "name" -> name,
                "constraint" -> constraint,
                "encode" -> encode
              )
            case StaticPart(value) =>
              JsString(value)
          }),
          "call" -> {
            val HandlerCall(packageName, controller, instantiate, method, parameters) = call
            Json.obj(
              "packageName" -> packageName,
              "controller" -> controller,
              "instantiate" -> instantiate,
              "method" -> method,
              "parameters" -> (parameters match {
                case Some(parameters) =>
                  JsArray(parameters map { case Parameter(name, typeName, fixed, default) =>
                    Json.obj(
                      "name" -> name,
                      "typeName" -> typeName,
                      "fixed" -> fixed,
                      "default" -> default
                    )
                  })
                case None => JsNull
              })
            )
          }
        )
      case Include(prefix, router) =>
        val fileName = """\.Routes$""".r.replaceAllIn(router, ".routes")
        val file = new File(s"conf/$fileName")
        generate(file, prefix)
    }

    def compile(file: File): Seq[Rule] = {
      val parser = new RouteFileParser
      val routeFile = file.getAbsoluteFile
      val routesContent = FileUtils readFileToString routeFile
      parser.parse(routesContent) match {
        // the original code checks `parsed`, (so) we don't (have to)
        case parser.Success(parsed, _) => parsed
        case _: parser.NoSuccess => Nil
      }
    }
    val routingInfos = generate(new File("conf/routes"))
    /*
      List(
        Route(GET,,controllers.Application.index,List()),
        Route(GET,$id<[^/]+>,controllers.Application.details(id:Long),List()),
        Route(GET,assets/$file<.+>,controllers.Assets.at(path:String = "/public", file:String), List())
      )
    */

  }

}
