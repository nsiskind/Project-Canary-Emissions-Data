package main

import (
	"fmt"
	"log"
	"net/http"

	"gocode/api"
	"gocode/db"

	_ "github.com/lib/pq"
)

// Database connection string
const (
	DbHost     = "0.0.0.0"
	DbPort     = "5433"
	DbUser     = "project_canary_takehome"
	DbPassword = "giveemissionsthebird"
	DbName     = "project_canary_takehome"
	Port       = ":8080"
)

func main() {

	db, err := db.NewPostgresDb(DbHost, DbPort, DbUser, DbPassword, DbName)
	if err != nil {
		log.Fatal("Error opening database: ", err)
	}
	defer db.Close()

	handler := api.NewApiHandeler(db)

	fmt.Printf("listening on port %v...\n", Port)
	log.Fatal(http.ListenAndServe(Port, handler))
}
