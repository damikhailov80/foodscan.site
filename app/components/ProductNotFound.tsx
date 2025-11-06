import ErrorPage from './ErrorPage';

export default function ProductNotFound() {
  return (
    <ErrorPage
      code="404"
      title="Product Not Found"
      message="Sorry, we couldn't find the food item you've scanned."
    />
  );
}
