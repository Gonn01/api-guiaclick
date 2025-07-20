import { algoliasearch } from 'algoliasearch';

const client = algoliasearch('P7ILDN8BXE', 'ab928c06c91003756c4c623deac711bd');

// Fetch and index objects in Algolia
export const processRecords = async () => {
    const datasetRequest = await fetch('http://localhost:3000/.netlify/functions/server/api/manuales/');

    const movies = await datasetRequest.json();
    console.log(movies.body);
    const records = movies.body.map(record => ({
        ...record,
        objectID: record.id,
    }));
    await client.clearObjects({ indexName: 'movies_index' });
    return await client.saveObjects({ indexName: 'movies_index', objects: records });
};

processRecords()
    .then(() => console.log('Successfully indexed objects!'))
    .catch((err) => console.error(err));