package api

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"gocode/db"
	"gocode/models"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewApiHandeler(sqlDb *sql.DB) http.Handler {

	router := mux.NewRouter()
	router.HandleFunc("/getEstimatedEmissions", func(w http.ResponseWriter, r *http.Request) { GetEstimatedEmissions(sqlDb, w) }).Methods("GET")
	router.HandleFunc("/getMeasuredEmissions", func(w http.ResponseWriter, r *http.Request) { GetMeasuredEmissions(sqlDb, w) }).Methods("GET")
	router.HandleFunc("/getSiteReference", func(w http.ResponseWriter, r *http.Request) { GetSiteReference(sqlDb, w) }).Methods("GET")
	router.HandleFunc("/upsertEstimatedEmissions", func(w http.ResponseWriter, r *http.Request) { UpsertEstimatedEmissions(sqlDb, w, r) }).Methods("POST")
	router.HandleFunc("/upsertMeasuredEmissions", func(w http.ResponseWriter, r *http.Request) { UpsertMeasuredEmissions(sqlDb, w, r) }).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	return c.Handler(router)
}

func GetEstimatedEmissions(sqlDb *sql.DB, w http.ResponseWriter) {
	response := db.GetEstimatedEmissions(sqlDb)
	json.NewEncoder(w).Encode(response)
}

func GetMeasuredEmissions(sqlDb *sql.DB, w http.ResponseWriter) {
	response := db.GetMeasuredEmissions(sqlDb)
	json.NewEncoder(w).Encode(response)
}

func GetSiteReference(sqlDb *sql.DB, w http.ResponseWriter) {
	response := db.GetEstimatedEmissions(sqlDb)
	json.NewEncoder(w).Encode(response)
}

func UpsertMeasuredEmissions(sqlDb *sql.DB, w http.ResponseWriter, r *http.Request) {

	body := models.MeasuredEmissions{}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatalf("invalid body")
	}
	json.Unmarshal(bodyBytes, &body)

	err = db.UpsertMeasuredEmissions(sqlDb, &body)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"response": err.Error()})
	} else {
		json.NewEncoder(w).Encode(map[string]string{"response": "success"})
	}
}

func UpsertEstimatedEmissions(sqlDb *sql.DB, w http.ResponseWriter, r *http.Request) {
	body := models.EstimatedEmissions{}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatalf("invalid body")
	}
	json.Unmarshal(bodyBytes, &body)

	err = db.UpsertEstimatedEmissions(sqlDb, &body)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"response": err.Error()})
	} else {
		json.NewEncoder(w).Encode(map[string]string{"response": "success"})
	}
}
