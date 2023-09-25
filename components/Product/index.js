import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import { useState } from "react";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  async function handleEditProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    console.log(response);

    if (response.ok) {
      mutate();
    }
  }

  async function handleDeleteProduct() {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

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
      <button
        type="button"
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
      >
        Edit your fish
      </button>
      {isEditMode && (
        <ProductForm
          onSubmit={handleEditProduct}
          value={data.product}
          isEditMode={true}
        />
      )}

      <hr />
      <button type="button" onClick={() => handleDeleteProduct(id)}>
        Delete Fish
      </button>
      <hr />
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
