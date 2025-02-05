package api

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

func RegisterApiRoutes(db *sql.DB) {

	getEstimatedEmissions(db)
}

func getEstimatedEmissions(db *sql.DB) {
	http.HandleFunc("/getAllEstimatedEmissions", func(w http.ResponseWriter, r *http.Request) {

		query := `SELECT * FROM estimated_emissions;`

		// Execute the query
		rows, err := db.Query(query)
		if err != nil {
			log.Fatal("Error executing query: ", err)
		}
		defer rows.Close()

		// Iterate through the rows
		var Id, Latitude, Longitude, EquipmentGroupName, Start, End, MethaneInKg string
		for rows.Next() {
			err := rows.Scan(&Id, &Latitude, &Longitude, &EquipmentGroupName, &Start, &End, &MethaneInKg)
			if err != nil {
				log.Fatal("Error scanning row: ", err)
			}
			fmt.Fprintf(w, "Id: %+v Row: %+v", Id, []string{Latitude, Longitude, EquipmentGroupName, Start, End, MethaneInKg})
		}

		// Check for any errors after iterating through rows
		if err := rows.Err(); err != nil {
			log.Fatal("Error iterating through rows: ", err)
		}
	})
}
