import { algoliasearch } from 'algoliasearch';

const client = algoliasearch('IQD8SWQI6A', '07b927cb2def710fd9a3c25d1c04a7a2');

// Fetch and index objects in Algolia
const processRecords = async () => {
    const datasetRequest = await fetch('http://localhost:3000/.netlify/functions/server/api/manuales/');

    const movies = await datasetRequest.json();
    console.log(movies.body);
    const records = movies.body.map(record => ({
        ...record,
        objectID: record.id,
    }));

    return await client.saveObjects({ indexName: 'movies_index', objects: records });
};

processRecords()
    .then(() => console.log('Successfully indexed objects!'))
    .catch((err) => console.error(err));