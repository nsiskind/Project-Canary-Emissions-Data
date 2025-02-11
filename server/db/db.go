package db

import (
	"fmt"
	"log"
	"math"

	"database/sql"
	"gocode/models"
)

var (
	CoordsSigFigs = 5
	Sites         = map[string]string{}
)

func NewPostgresDb(dbHost string, dbPort string, dbUser string, dbPassword string, dbName string) (*sql.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %v", err)
	}
	fmt.Println("Successfully connected to the database")

	return db, nil
}

func GetEstimatedEmissions(db *sql.DB) []models.EstimatedEmissions {
	if len(Sites) == 0 {
		Sites = getSitesByLatLong(db)
	}

	query := `SELECT * FROM estimated_emissions;`

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

	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}

	return response
}

func GetMeasuredEmissions(db *sql.DB) []models.MeasuredEmissions {
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

	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}

	return response
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
	return lat[:int(math.Min(float64(len(lat)), float64(CoordsSigFigs)))] + "," + long[:int(math.Min(float64(len(long)), float64(CoordsSigFigs)))]
}

func GetSiteReference(db *sql.DB) []models.SiteReference {
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

	if err := rows.Err(); err != nil {
		log.Fatal("Error iterating through rows: ", err)
	}

	return response
}

func UpsertEstimatedEmissions(sqlDb *sql.DB, data *models.EstimatedEmissions) error {

	// if site doesn't exist or site name has changed, update
	siteKey := getLatLongKey(data.Latitude, data.Longitude)
	if site, ok := Sites[siteKey]; !ok || site != data.Site {
		err := UpsertSiteReference(sqlDb, &models.SiteReference{Site: data.Site, Latitude: data.Latitude, Longitude: data.Longitude})
		if err != nil {
			return err
		}
		Sites[siteKey] = data.Site
	}

	query := `
		INSERT INTO estimated_emissions (Latitude, Longitude, EquipmentGroupName, "Start", "End", MethaneInKg)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (Latitude, Longitude, EquipmentGroupName, "Start", "End") 
		DO UPDATE SET 
			MethaneInKg = EXCLUDED.MethaneInKg
	`

	_, err := sqlDb.Exec(query, data.Latitude, data.Longitude, data.EquipmentGroupName, data.Start, data.End, data.MethaneInKg)
	if err != nil {
		log.Fatal("could not upsert estimated emission", err.Error())
		return err
	}
	return nil
}

func UpsertMeasuredEmissions(db *sql.DB, data *models.MeasuredEmissions) error {

	siteKey := getLatLongKey(data.Latitude, data.Longitude)

	// if site doesn't exist or site name has changed, update
	if site, ok := Sites[siteKey]; !ok || site != data.Site {
		err := UpsertSiteReference(db, &models.SiteReference{Site: data.Site, Latitude: data.Latitude, Longitude: data.Longitude})
		if err != nil {
			return err
		}
		Sites[siteKey] = data.Site
	}
	query := `
		INSERT INTO measured_emissions (Latitude, Longitude, "Start", "End", EquipmentGroupName, EquipmentId, MethaneInKg)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (Latitude, Longitude, EquipmentGroupName, EquipmentId, "Start", "End") 
		DO UPDATE SET 
			MethaneInKg = EXCLUDED.MethaneInKg	`

	_, err := db.Exec(query, data.Latitude, data.Longitude, data.Start, data.End, data.EquipmentGroupName, data.EquipmentId, data.MethaneInKg)
	if err != nil {
		log.Fatal("could not upsert emission", err.Error())
		return err
	}
	return nil
}

func UpsertSiteReference(db *sql.DB, data *models.SiteReference) error {
	query := `
		INSERT INTO site_reference (Latitude, Longitude, "Site")
		VALUES ($1, $2, $3)
		ON CONFLICT (Latitude, Longitude) 
		DO UPDATE SET 
			"Site" = EXCLUDED."Site"`

	_, err := db.Exec(query, data.Latitude, data.Longitude, data.Site)
	if err != nil {
		log.Fatal("could not upsert site", err.Error())
		return err
	}

	return nil
}
