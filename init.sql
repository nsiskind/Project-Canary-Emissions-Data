CREATE TABLE IF NOT EXISTS estimated_emissions (
    Id SERIAL PRIMARY KEY,
    Latitude VARCHAR(100),
    Longitude VARCHAR(100),
    EquipmentGroupName VARCHAR(100),
    "Start" VARCHAR(100),
    "End" VARCHAR(100),
    MethaneInKg VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS measured_emissions (
    Id SERIAL PRIMARY KEY,
    Latitude VARCHAR(100),
    Longitude VARCHAR(100),
    "Start" VARCHAR(100),
    "End" VARCHAR(100),
    EquipmentGroupName VARCHAR(100),
    EquipmentId VARCHAR(100),
    MethaneInKg VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS site_reference (
    Id SERIAL PRIMARY KEY,
    "Site" VARCHAR(100),
    Latitude VARCHAR(100),
    Longitude VARCHAR(100)
);

ALTER TABLE estimated_emissions
ADD CONSTRAINT unique_measured_emission
UNIQUE (Latitude, Longitude, EquipmentGroupName, "Start", "End");

ALTER TABLE measured_emissions
ADD CONSTRAINT unique_estimated_emission
UNIQUE (Latitude, Longitude, EquipmentGroupName, EquipmentId, "Start", "End");

ALTER TABLE site_reference
ADD CONSTRAINT unique_site
UNIQUE (Latitude, Longitude);

-- Load data from CSV files into the tables
COPY estimated_emissions(Latitude, Longitude, EquipmentGroupName, "Start", "End", MethaneInKg)
FROM '/data/estimated_emissions.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');

COPY measured_emissions(Latitude, Longitude, "Start", "End", EquipmentGroupName, EquipmentId, MethaneInKg)
FROM '/data/measured_emissions.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');

COPY site_reference("Site", Latitude, Longitude)
FROM '/data/site_reference.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');
