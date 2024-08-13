export const upload = async (file: File, path: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`https://cdn.nextflow.cloud/stores/${path}`, {
        method: "POST",
        body: formData
    });
    const json = await response.json();
    return json.url;
}

export const uploadAvatar = async (file: File): Promise<string> => {
    return upload(file, "avatars");
}
