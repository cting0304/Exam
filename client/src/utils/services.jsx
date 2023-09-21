export const baseUrl = "http://localhost:4000";

export const postRequest = async (url, body) => {
    console.log(baseUrl + url)
    try {
        const response = await fetch(baseUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const data = await response.json();
            let message = "An error occurred";

            if (data?.message) {
                message = data.message;
            }

            throw new Error(message);
        }

        return await response.json();   
    } catch (error) {
        return { error: true, message: error.message };
    }
};

