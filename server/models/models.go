package models

type EstimatedEmissions struct {
	Id                 int    `json:"id"`
	Latitude           string `json:"latitude"`
	Longitude          string `json:"longitude"`
	EquipmentGroupName string `json:"equipment_group_name"`
	Start              string `json:"start"`
	End                string `json:"end"`
	MethaneInKg        string `json:"methane_in_kg"`
}

type MeasuredEmissions struct {
	Id                 int    `json:"id"`
	Latitude           string `json:"latitude"`
	Longitude          string `json:"longitude"`
	EquipmentGroupName string `json:"equipment_group_name"`
	Start              string `json:"start"`
	End                string `json:"end"`
	EquipmentId        string `json:"equipment_id"`
	MethaneInKg        string `json:"methane_in_kg"`
}

type SiteReference struct {
	Id        int    `json:"id"`
	Site      string `json:"site"`
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}
