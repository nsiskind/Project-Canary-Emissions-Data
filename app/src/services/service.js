export async function FetchMeasuredEmissions() {
    return getData('http://localhost:8080/getMeasuredEmissions');
}

export async function FetchEstimatedEmissions() {
  return getData('http://localhost:8080/getEstimatedEmissions');
}

export async function FetchSiteReference() {
  return getData('http://localhost:8080/getSiteReference');
}

export async function UpsertEstimatedEmission(body) {
  return postData('http://localhost:8080/upsertEstimatedEmissions', body);
}

export async function UpsertMeasuredEmission(body) {
  return postData('http://localhost:8080/upsertMeasuredEmissions', body);
}

async function postData(url, body) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body) 
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    return error;
  }
}

async function getData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
}