import ErrorPage from './ErrorPage';

export default function InvalidBarcode() {
  return (
    <ErrorPage
      code="400"
      title="Invalid Barcode"
      message="The barcode number is not valid. Please try scanning again."
    />
  );
}
