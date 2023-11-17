package api

import (
	"log"
	"net/http"
	"os"
	"task/go/ent"
	"task/go/graphql"

	"entgo.io/ent/dialect"
	"github.com/99designs/gqlgen/graphql/handler"

	_ "github.com/go-sql-driver/mysql"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	dbUrl, isPresent := os.LookupEnv("DATABASE_URL")
	if !isPresent {
		log.Fatalf("Environment variable DATABASE_URL is missing")
	}

	client, err := ent.Open(dialect.MySQL, dbUrl)
	if err != nil {
		log.Fatalf("Failed to open DB connection %v", err)
	}
	defer client.Close()

	srv := handler.NewDefaultServer(graphql.NewSchema(client))
	srv.ServeHTTP(w, r)
}
