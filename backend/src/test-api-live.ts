import axios from 'axios';

async function testApi() {
    console.log('Testing API: http://localhost:5000/api/leads');
    try {
        const response = await axios.get('http://localhost:5000/api/leads');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testApi();
