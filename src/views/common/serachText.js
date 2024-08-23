const removeSpecials = (search) => search.replace(/[^a-zA-Z0-9@. ]/g, "").trim();
export default removeSpecials;
