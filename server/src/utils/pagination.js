export const parseLinkHeader = (link) => {
    const links = {};
    const parts = link ? link.split(", ") : [];
    
    parts.forEach((part) => {
        const sections = part.split(";");

        if (sections.length !== 2) return;

        const url = sections[0].replace(/<(.*)>/, "$1").trim();
        const name = sections[1].replace(/rel="(.*)"/, "$1").trim();

        const urlOjb = new URL(url);
        const page = urlOjb.searchParams.get("page");
        
        links[name] = page ? parseInt(page) : null;
    });

    return links;
};
