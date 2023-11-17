package main

import (
	"log"
	"net/http"
	"os"
	"task/go/ent"
	"task/go/graphql"

	"entgo.io/ent/dialect"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dbUrl, isPresent := os.LookupEnv("DATABASE_URL")
	if !isPresent {
		log.Fatalf("Environment variable DATABASE_URL is missing")
	}

	// Create ent.Client and run the schema migration.
	client, err := ent.Open(dialect.MySQL, dbUrl)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer client.Close()

	// Configure the server and start listening on :8081.
	srv := handler.NewDefaultServer(graphql.NewSchema(client))
	http.Handle("/",
		playground.Handler("Task", "/query"),
	)
	http.Handle("/query", srv)
	log.Println("listening on :8081")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal("http server terminated", err)
	}
}
