async function testBackendSearch() {
  const response = await fetch('http://127.0.0.1:8787/search/enrich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'Marília - SP',
      segment: 'Odontologia',
      quantity: 9
    })
  });
  
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testBackendSearch();
