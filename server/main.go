package main

import (
	"fmt"
	"log"
	"net/http"

	"gocode/api"
	"gocode/db"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
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

	router := mux.NewRouter()
	router.HandleFunc("/getEstimatedEmissions", func(w http.ResponseWriter, r *http.Request) { api.GetEstimatedEmissions(db, w) }).Methods("GET")
	router.HandleFunc("/getMeasuredEmissions", func(w http.ResponseWriter, r *http.Request) { api.GetMeasuredEmissions(db, w) }).Methods("GET")
	router.HandleFunc("/getSiteReference", func(w http.ResponseWriter, r *http.Request) { api.GetSiteReference(db, w) }).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)
	fmt.Printf("listening on port %v...\n", Port)
	log.Fatal(http.ListenAndServe(Port, handler))
}
