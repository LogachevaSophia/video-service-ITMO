class LlmService {
    constructor() {
    }

    async prompt(text) {
        const body = {
            prompt: JSON.stringify(text),
            model: 'gpt-4o',
        }

        console.log('Request body:', body);

        // Make a request to Morty API
        const response = await fetch(`${process.env.MORTY_URL}/prompt?`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MORTY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error('Status:', response.status);
            console.error('Error:', response.statusText);
            console.error('Response:', await response.text());
            return null;
        }

        let jsonResponse = await response.json()

        return jsonResponse.response
    }
}

exports.LlmService = LlmService;