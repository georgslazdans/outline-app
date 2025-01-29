export const idQuery = (value: string) => {
    const params = new URLSearchParams()
    params.set("id", value)
    return params.toString()
};