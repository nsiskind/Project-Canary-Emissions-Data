package models

type EstimatedEmissions struct {
	Id                 string `json:"id"`
	Latitude           string `json:"latitude"`
	Longitude          string `json:"longitude"`
	EquipmentGroupName string `json:"equipmentGroupName"`
	Start              string `json:"start"`
	End                string `json:"end"`
	MethaneInKg        string `json:"methaneInKg"`
}

type MeasuredEmissions struct {
	Id                 string `json:"id"`
	Latitude           string `json:"latitude"`
	Longitude          string `json:"longitude"`
	EquipmentGroupName string `json:"equipmentGroupName"`
	Start              string `json:"start"`
	End                string `json:"end"`
	EquipmentId        string `json:"equipmentId"`
	MethaneInKg        string `json:"methaneInKg"`
}

type SiteReference struct {
	Id        string `json:"id"`
	Site      string `json:"site"`
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}
