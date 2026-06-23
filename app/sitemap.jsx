import axios from "axios";

const apiBaseUrl = "https://api-ekfyledvua-ew.a.run.app";

export default async function sitemap() {

    const urls = [
        "https://doifrati.ro",
        "https://doifrati.ro/blog"
    ];
    const paths = urls.map((url) => {return{url:url}});

    let products = await axios.get(`${apiBaseUrl}/products`).then((res) => res.data);
    products = products.map(p=>{
        return {
            url:p.url,
        }
    })
    paths.push(...products);

    return paths;
  }