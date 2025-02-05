package db

import (
	"database/sql"
	"fmt"
)

func NewPostgresDb(dbHost string, dbPort string, dbUser string, dbPassword string, dbName string) (*sql.DB, error) {
	// Build the connection string
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

	// Open a connection to the database
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err)
	}

	// Ping the database to check if it's reachable
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %v", err)
	}
	fmt.Println("Successfully connected to the database")

	return db, nil
}
