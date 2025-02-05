package main

import (
	"fmt"
	"log"
	"net/http"

	"gocode/api"
	"gocode/db"
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

	api.RegisterApiRoutes(db)

	fmt.Printf("Starting server on port %s...\n", Port)
	log.Fatal(http.ListenAndServe(Port, nil))
}
