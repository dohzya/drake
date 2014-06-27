lazy val root = project.in(file(".")).enablePlugins(PlayScala)

name := "drake"

libraryDependencies += "org.webjars" % "requirejs" % "2.1.14-1"