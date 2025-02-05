export async function FetchMeasuredEmissions() {
    return getData('http://localhost:8080/getMeasuredEmissions');
}

export async function FetchEstimatedEmissions() {
  return getData('http://localhost:8080/getEstimatedEmissions');
}

export async function FetchSiteReference() {
  return getData('http://localhost:8080/getSiteReference');
}

  

async function getData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    console.log(response)

    const data = await response.json();
    
    console.log(data)

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}