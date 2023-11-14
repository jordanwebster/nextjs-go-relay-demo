package api

import (
	"log"
	"net/http"
	"todo/go/ent"
	"todo/go/graphql"

	"entgo.io/ent/dialect"
	"github.com/99designs/gqlgen/graphql/handler"

	_ "github.com/go-sql-driver/mysql"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// TODO: Use environment variable for connection string
	client, err := ent.Open(dialect.MySQL, "jlw@/todo")
	if err != nil {
		log.Fatalf("Failed to open DB connection %v", err)
	}
	defer client.Close()

	srv := handler.NewDefaultServer(graphql.NewSchema(client))
	srv.ServeHTTP(w, r)
}
