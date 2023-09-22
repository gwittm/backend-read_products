import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useSWR(`/api/products/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      <hr />
      <h4>🐟🐠Reviews🐡🐳</h4>
      {data.reviews ? (
        data.reviews.map((review) => (
          <article key={review._id}>
            <p>
              <strong>{review.title}</strong>
            </p>
            <p>{review.rating} / 5 ⭐️</p>
            <p>{review.text}</p>
          </article>
        ))
      ) : (
        <p>No Reviews yet ...</p>
      )}
      <hr />
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
