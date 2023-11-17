package main

import (
	"context"
	"log"
	"os"
	"task/go/ent"

	"entgo.io/ent/dialect"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dbUrl, isPresent := os.LookupEnv("DATABASE_URL")
	if !isPresent {
		log.Fatalf("Environment variable DATABASE_URL is missing")
	}

	client, err := ent.Open(dialect.MySQL, dbUrl)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer client.Close()

	ctx := context.Background()

	if err = client.Schema.Create(ctx); err != nil {
		log.Fatalf("Failed creating schema resources: %v", err)
	}
}
