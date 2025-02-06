package api

import (
	"database/sql"
	"encoding/json"
	"gocode/models"
	"log"
	"net/http"
)

var (
	CoordsSigFigs = 5
	Sites         = map[string]string{}
)

func GetEstimatedEmissions(db *sql.DB, w http.ResponseWriter) {
	if len(Sites) == 0 {
		Sites = getSitesByLatLong(db)
	}

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
			Site:               Sites[getLatLongKey(Latitude, Longitude)],
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
	if len(Sites) == 0 {
		Sites = getSitesByLatLong(db)
	}

	query := `SELECT * FROM measured_emissions;`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	response := []models.MeasuredEmissions{}
	var Id, Latitude, Longitude, Start, End, EquipmentGroupName, EquipmentId, MethaneInKg string
	for rows.Next() {
		err := rows.Scan(&Id, &Latitude, &Longitude, &Start, &End, &EquipmentGroupName, &EquipmentId, &MethaneInKg)
		if err != nil {
			log.Fatal("Error scanning row: ", err)
		}
		response = append(response, models.MeasuredEmissions{
			Id:                 Id,
			Site:               Sites[getLatLongKey(Latitude, Longitude)],
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

func getSitesByLatLong(db *sql.DB) map[string]string {
	query := `SELECT * FROM site_reference;`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("Error executing query: ", err)
	}
	defer rows.Close()

	response := map[string]string{}

	var Id, Latitude, Longitude, Site string
	for rows.Next() {
		err := rows.Scan(&Id, &Site, &Latitude, &Longitude)
		if err != nil {
			log.Fatal("Error scanning row: ", err)
		}

		response[getLatLongKey(Latitude, Longitude)] = Site
	}

	return response
}

func getLatLongKey(lat string, long string) string {
	return lat[:CoordsSigFigs] + "," + long[:CoordsSigFigs]
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
