package main

import (
	"log"
	"net/http"
	"todo/go/ent"
	"todo/go/graphql"

	"entgo.io/ent/dialect"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Create ent.Client and run the schema migration.
	client, err := ent.Open(dialect.MySQL, "jlw@/todo")
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer client.Close()

	// Configure the server and start listening on :8081.
	srv := handler.NewDefaultServer(graphql.NewSchema(client))
	http.Handle("/",
		playground.Handler("Todo", "/query"),
	)
	http.Handle("/query", srv)
	log.Println("listening on :8081")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal("http server terminated", err)
	}
}
