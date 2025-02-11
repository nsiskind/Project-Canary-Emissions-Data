# Project Canary Emissions - Take-Home Assignment

This repository contains code to visualize and compare methane emissions data.

The following features are availible:

**Viewing**
- view all estimated emissions data
- view all measured emissions data
- compare measured emissions with estimated emissions for that time frame
    - measured emissions are aggregated by site, equipment group, start, and end
- sort and filter on any field, allowing for easy access to data

**Adding**
- add measured emissions data
- add estimated emissions data
- measured and estimated data CAN be overwritten to account for rare cases where original data or estimates were incorrect
- adding data will also add a new site if that site has not been seen before
- if current coordinates are associated with a new site, the site will be overriden for all existing data, to account for any potential site renames

To get started:

Set up database and populate with initial data:
```
docker-compose up -d
```

Install go dependencies and start server:

```
cd server
go mod download
go run main.go
```

Insall npm dependancies and start client:

```
cd app
npm install
npm start
```

Navigate to http://localhost:3000/ to view the emissions data!


# Project Canary Emissions - Take-Home Assignment (Old Readme)

This project involves building a system to process and visualize methane emissions data. The backend is scaffolded in C# using .NET 8. This is a suggested starting point for the project, but you're free to choose your own implementation.
## Description
We have estimated and measured methane emissions data, in kg, that we would like to reconcile. Also provided is a site reference document with site centers and names.

The client has given us their calculated estimated emissions for their locations for a period of time. We have sourced the data measured from our devices installed at the location(s).

As a user I would like to be able to compare my estimated and measured data across my portfolio. I may want to visualize the data by different groupings. I should be able to upload new/additional data from the UI. 

## What's important to us
* Attention to code structure.
* Treat this project as if you're developing for a large scale system
* That you demonstrate thought about the product requirements
* Feel free to ask follow up questions.

## Don't worry about
* Authentication 
* Dockerizing the API

## Setup

To set up and run the project, follow these steps:

1. Start the PostgreSQL database using Docker Compose. From the root directory, run:

```docker-compose up -d```

2. Apply the database migrations to set up the schema. Run the following command:

```ef database update --connection "Host=localhost;Port=5433;Database=project_canary_takehome;Username=project_canary_takehome;Password=giveemissionsthebird"```

## Deliverables
* Fullstack application repo as a zip file or a github repo
* README of how to run the application

You may submit a zip of your completed backend and frontend solutions, or share them with us on GitHub. 

Keep your implementation clean and simple and contact us if you have questions. Good luck!
