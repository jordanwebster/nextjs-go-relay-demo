package main

import (
	"context"
	"log"
	"todo/go/ent"

	"entgo.io/ent/dialect"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	client, err := ent.Open(dialect.MySQL, "jlw@/todo")
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer client.Close()

	ctx := context.Background()

	if err = client.Schema.Create(ctx); err != nil {
		log.Fatalf("Failed creating schema resources: %v", err)
	}
}
