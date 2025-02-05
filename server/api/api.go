package api

import (
	"database/sql"
	"encoding/json"
	"gocode/models"
	"log"
	"net/http"
)

func GetEstimatedEmissions(db *sql.DB, w http.ResponseWriter) {
	query := `SELECT * FROM estimated_emissions;`

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	response := []models.EstimatedEmissions{}
	var Id, Latitude, Longitude, EquipmentGroupName, Start, End, MethaneInKg string
	for rows.Next() {
		err := rows.Scan(&Id, &Latitude, &Longitude, &EquipmentGroupName, &Start, &End, &MethaneInKg)
		if err != nil {
			log.Fatal("Error scanning row: ", err)
		}
		response = append(response, models.EstimatedEmissions{
			Id:                 Id,
			Latitude:           Latitude,
			Longitude:          Longitude,
			EquipmentGroupName: EquipmentGroupName,
			Start:              Start,
			End:                End,
			MethaneInKg:        MethaneInKg,
		})
	}

	// Check for any errors after iterating through rows
	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}
	json.NewEncoder(w).Encode(response)
}

func GetMeasuredEmissions(db *sql.DB, w http.ResponseWriter) {

	query := `SELECT * FROM measured_emissions;`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	response := []models.MeasuredEmissions{}
	var Id, Latitude, Longitude, EquipmentGroupName, Start, End, EquipmentId, MethaneInKg string
	for rows.Next() {
		err := rows.Scan(&Id, &Latitude, &Longitude, &EquipmentGroupName, &Start, &End, &EquipmentId, &MethaneInKg)
		if err != nil {
			log.Fatal("Error scanning row: ", err)
		}
		response = append(response, models.MeasuredEmissions{
			Id:                 Id,
			Latitude:           Latitude,
			Longitude:          Longitude,
			EquipmentGroupName: EquipmentGroupName,
			Start:              Start,
			End:                End,
			EquipmentId:        EquipmentId,
			MethaneInKg:        MethaneInKg,
		})
	}

	// Check for any errors after iterating through rows
	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}

	json.NewEncoder(w).Encode(response)
}

func GetSiteReference(db *sql.DB, w http.ResponseWriter) {
	query := `SELECT * FROM site_reference;`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	response := []models.SiteReference{}
	var Id, Latitude, Longitude, Site string
	for rows.Next() {
		err := rows.Scan(&Id, &Latitude, &Longitude, &Site)
		if err != nil {
			log.Fatal("Error scanning row: ", err)
		}
		response = append(response, models.SiteReference{
			Id:        Id,
			Site:      Site,
			Latitude:  Latitude,
			Longitude: Longitude,
		})
	}

	// Check for any errors after iterating through rows
	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}

	json.NewEncoder(w).Encode(response)
}
