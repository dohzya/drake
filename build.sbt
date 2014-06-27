lazy val root = project.in(file(".")).enablePlugins(PlayScala)

name := "drake"

libraryDependencies ++= Seq(
  "org.webjars" % "requirejs" % "2.1.14-1",
  "com.typesafe.play" %% "routes-compiler" % play.core.PlayVersion.current
)
