"use client";

import { useState } from "react";

export default function CloudinaryDebugPage() {
    const [status, setStatus] = useState<string>("Ready");
    const [response, setResponse] = useState<any>(null);
    const [envStatus, setEnvStatus] = useState<any>(null);

    const checkEnv = async () => {
        try {
            const res = await fetch("/api/debug-env");
            const data = await res.json();
            setEnvStatus(data);
        } catch (e) {
            setEnvStatus("Failed to check env");
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setStatus("Uploading...");
        setResponse(null);

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setStatus(`Finished with status: ${res.status}`);
            setResponse(data);
        } catch (err: any) {
            setStatus("Error during fetch");
            setResponse(err.message);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto ltr" dir="ltr">
            <h1 className="text-2xl font-bold mb-6">Cloudinary Diagnostics</h1>

            <div className="mb-8 p-4 border rounded bg-gray-50">
                <h2 className="font-bold mb-2">1. Check Server Config</h2>
                <button
                    onClick={checkEnv}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Check Environment Variables
                </button>
                {envStatus && (
                    <pre className="mt-4 bg-black text-white p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(envStatus, null, 2)}
                    </pre>
                )}
            </div>

            <div className="mb-8 p-4 border rounded bg-gray-50">
                <h2 className="font-bold mb-2">2. Test Upload</h2>
                <input
                    type="file"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />

                <div className="mt-4">
                    <p className="font-semibold">Status: <span className="font-normal">{status}</span></p>
                </div>

                {response && (
                    <div className="mt-4">
                        <p className="font-semibold mb-2">Server Response:</p>
                        <pre className="bg-black text-white p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}

                {response?.url && (
                    <div className="mt-4">
                        <p className="font-semibold mb-2">Image Preview:</p>
                        <img src={response.url} alt="Uploaded" className="max-w-xs border rounded shadow" />
                    </div>
                )}
            </div>
        </div>
    );
}
