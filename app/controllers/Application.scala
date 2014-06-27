package controllers

import play.api.mvc.{Action, Controller}

object Application extends Controller {

  val index = Action {
    Ok(views.html.index())
  }

  def details(id: Long) = Action {
    Ok(views.html.details(id))
  }

}