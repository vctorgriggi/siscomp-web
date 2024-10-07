import Grid from "@mui/material/Grid";

import MainFeaturedPost from "../../components/post/MainFeaturedPost";
import AdministrativePanel from "../../layouts/AdministrativePanel";
import FeaturedPost from "../../components/post/FeaturedPost";

/* posts */
const mainFeaturedPost = {
  title: "What are in-ear monitors?",
  supporting: "All you need to know about this special category of earphones.",
  image:
    "https://www.soundguys.com/wp-content/uploads/2023/04/Moondrop-Aria-SE-earbuds-in-case-1000x563.jpg.webp",
  imageAlt: "main image description",
  linkText: "https://www.soundguys.com/what-are-in-ear-monitors-90955/",
};

const featuredPosts = [
  {
    linkContent: "https://youtu.be/perG1qVGJAA?si=kGPiW0P9o43uGbWj",
    title: " MUDANÇAS RADICAIS: Yanyin Canon 2",
    date: "Apr 15",
    supporting:
      "Quer apoiar o canal e ter acesso a benefícios como sorteios mensais de fones, consultorias particulares, acesso a lives exclusivas e participação de um grupo no Telegram?",
    image: "https://img.youtube.com/vi/perG1qVGJAA/maxresdefault.jpg",
    imageAlt: "Image Text",
  },
  {
    linkContent:
      "https://headphones.com/blogs/reviews/moondrop-x-crinacle-dusk-an-inconvenient-truth",
    title: "Moondrop x Crinacle DUSK: An Inconvenient Truth",
    date: "Apr 14",
    supporting:
      "Crinacle's new DUSK was an IEM that was uniquely positioned to fulfill the wishes of consumers asking for an IEM tuned with the Brüel and Kjaer Type 5128 in mind. However, due to the reliance on the DSP cable to grant that wish, saying 'Buy DUSK' isn't quite as simple this time around.",
    image:
      "https://headphones.com/cdn/shop/articles/DUSK-Tree1_da01a1e3-9419-4a09-b459-a59bcc704a24.jpg?v=1713308906&width=1100",
    imageAlt: "Image Text",
  },
];

export default function Inicio() {
  return (
    <AdministrativePanel>
      <MainFeaturedPost post={mainFeaturedPost} />
      <Grid container spacing={4}>
        {featuredPosts.map((post) => (
          <FeaturedPost key={post.title} post={post} />
        ))}
      </Grid>
    </AdministrativePanel>
  );
}
